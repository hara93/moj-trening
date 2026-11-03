// Cuts a demo video for the app with macOS AVFoundation (no ffmpeg needed): crop, trim, H.264 High without sound, fast start,
// plus a JPEG poster frame. build_media.py --recut runs it for every licensed video that has a "recut" recipe.
// usage: swift crop_video.swift <in.mp4> <out.mp4> <poster.jpg> <x> <y> <w> <h> <start s> <end s> <kbit/s> <poster at s> [<out w> <out h>]
import AVFoundation
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
guard a.count == 12 || a.count == 14, let x = Double(a[4]), let y = Double(a[5]), let w = Int(a[6]), let h = Int(a[7]),
      let t0 = Double(a[8]), let t1 = Double(a[9]), let kbps = Int(a[10]), let posterAt = Double(a[11]) else {
    print("usage: swift crop_video.swift <in.mp4> <out.mp4> <poster.jpg> <x> <y> <w> <h> <start> <end> <kbit/s> <poster at> [<out w> <out h>]"); exit(2)
}
let ow = a.count == 14 ? Int(a[12]) ?? w : w, oh = a.count == 14 ? Int(a[13]) ?? h : h
let src = URL(fileURLWithPath: a[1]), dst = URL(fileURLWithPath: a[2]), posterURL = URL(fileURLWithPath: a[3])

let asset = AVURLAsset(url: src)
guard let track = try await asset.loadTracks(withMediaType: .video).first else { print("no video track"); exit(1) }
let fps = try await track.load(.nominalFrameRate)
let frame = try await track.load(.minFrameDuration)
let total = try await asset.load(.duration)
let range = CMTimeRange(start: CMTime(seconds: t0, preferredTimescale: 600), end: CMTime(seconds: min(t1, total.seconds), preferredTimescale: 600))

// the crop: move the wanted rectangle to the origin, then scale it to the output size
let comp = AVMutableVideoComposition()
comp.renderSize = CGSize(width: ow, height: oh)
comp.frameDuration = frame.isValid && frame.seconds >= 1.0 / 30 ? frame : CMTime(value: 1, timescale: 30)   // at most 30 frames per second
let instr = AVMutableVideoCompositionInstruction()
instr.timeRange = CMTimeRange(start: .zero, duration: total)
let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
layer.setTransform(CGAffineTransform(translationX: -x, y: -y).concatenating(CGAffineTransform(scaleX: Double(ow) / Double(w), y: Double(oh) / Double(h))), at: .zero)
instr.layerInstructions = [layer]
comp.instructions = [instr]

let reader = try AVAssetReader(asset: asset)
reader.timeRange = range
let output = AVAssetReaderVideoCompositionOutput(videoTracks: [track], videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
output.videoComposition = comp
reader.add(output)

try? FileManager.default.removeItem(at: dst)
let writer = try AVAssetWriter(outputURL: dst, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true
let rate = Int(min(fps > 0 ? fps : 30, 30).rounded())
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: ow, AVVideoHeightKey: oh,
    AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: kbps * 1000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
                                      AVVideoMaxKeyFrameIntervalKey: rate * 2, AVVideoExpectedSourceFrameRateKey: rate]])
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: nil)
writer.add(input)
guard reader.startReading(), writer.startWriting() else { print("start failed:", reader.error ?? writer.error ?? "?"); exit(1) }
writer.startSession(atSourceTime: .zero)
var frames = 0
while let sb = output.copyNextSampleBuffer() {
    guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
    let pts = CMTimeSubtract(CMSampleBufferGetPresentationTimeStamp(sb), range.start)
    if pts < .zero { continue }
    while !input.isReadyForMoreMediaData { usleep(2000) }
    if !adaptor.append(pb, withPresentationTime: pts) { print("append failed:", writer.error ?? "?"); exit(1) }
    frames += 1
}
input.markAsFinished()
writer.endSession(atSourceTime: range.duration)
await writer.finishWriting()
guard writer.status == .completed else { print("write failed:", writer.error ?? "?"); exit(1) }

// poster: one frame of the new clip, as JPEG
let gen = AVAssetImageGenerator(asset: AVURLAsset(url: dst))
gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
let (cg, _) = try await gen.image(at: CMTime(seconds: posterAt, preferredTimescale: 600))
guard let out = CGImageDestinationCreateWithURL(posterURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else { exit(1) }
CGImageDestinationAddImage(out, cg, [kCGImageDestinationLossyCompressionQuality: 0.82] as CFDictionary)
guard CGImageDestinationFinalize(out) else { print("poster failed"); exit(1) }
let bytes = (try FileManager.default.attributesOfItem(atPath: dst.path)[.size] as? Int) ?? 0
print(String(format: "%@: %dx%d, %d frames, %.2f s, %d bytes, %.0f kbit/s", dst.lastPathComponent, ow, oh, frames, range.duration.seconds, bytes, Double(bytes) * 8 / 1000 / range.duration.seconds))
