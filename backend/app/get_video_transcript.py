import whisper
from io import BytesIO
import tempfile
from moviepy import VideoFileClip
import os

def get_video_transcript(video_file):
	try:
		# Read the uploaded video file into memory
		video_bytes = video_file.file.read()
		print("Step 1")

		# Use BytesIO to simulate a file object in memory
		video_stream = BytesIO(video_bytes)
		print("Step 2")

		# Get the current working directory
		current_dir = os.getcwd()
		print("Step 3")

		# Create a temporary file for the video
		with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4', dir=current_dir) as temp_video_file:
			temp_video_path = temp_video_file.name
			temp_video_file.write(video_stream.read())
		print("Step 4")

		# Load the video from the temporary file object
		video = VideoFileClip(temp_video_path)
		converted_audio = video.audio
		print("Step 5")

		# Save audio to a temporary file
		with tempfile.NamedTemporaryFile(delete=False, suffix='.wav', dir=current_dir) as temp_audio_file:
			temp_audio_path = temp_audio_file.name
			converted_audio.write_audiofile(temp_audio_path, codec='pcm_s16le')
		print("Step 6")
		
		with open(temp_audio_path, 'rb') as f:
			audio_stream = BytesIO(f.read())
		print("Step 7")
		
		# Reset audio stream position to the beginning
		audio_stream.seek(0)
		print("Step 8")

		# Load the Whisper model
		model = whisper.load_model("tiny")
		print("Step 9")
		
		print("Audio path:", temp_audio_path)
		# Load the audio for transcription
		audio = whisper.load_audio(temp_audio_path)
		print("Step 10")

		# Transcribe the audio
		result = model.transcribe(audio)

		os.remove(temp_video_path)
		os.remove(temp_audio_path)

		# Collect and return the transcript
		transcript = ""
		for segment in result["segments"]:
				transcript += segment["text"] + " "

		# Return the transcript
		return transcript.strip()

	except Exception as e:
		print(f"Error processing: {str(e)}")
		return None