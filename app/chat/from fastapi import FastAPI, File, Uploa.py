from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
import speech_recognition as sr
import tempfile, subprocess, io
from gtts import gTTS

app = FastAPI()

# ...existing endpoints...

@app.post("/stt")
async def stt(audio: UploadFile = File(...)):
    # 1) save incoming webm to temp
    tmp_in = tempfile.NamedTemporaryFile(suffix=".webm", delete=False)
    tmp_in.write(await audio.read()); tmp_in.flush()
    # 2) convert to WAV via ffmpeg
    wav_path = tmp_in.name + ".wav"
    subprocess.run(["ffmpeg", "-i", tmp_in.name, wav_path], check=True)
    # 3) run SpeechRecognition on the WAV
    r = sr.Recognizer()
    with sr.AudioFile(wav_path) as source:
        audio_data = r.record(source)
    try:
        transcript = r.recognize_google(audio_data)
    except sr.UnknownValueError:
        transcript = ""
    return {"transcript": transcript}

@app.post("/speak")
async def speak(text: str):
    # 1) generate MP3 into memory
    buf = io.BytesIO()
    gTTS(text=text, lang="en").write_to_fp(buf)
    buf.seek(0)
    # 2) stream back as audio/mpeg
    return StreamingResponse(buf, media_type="audio/mpeg")

# ...existing endpoints...
