from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import io
import os
import fitz
import google.generativeai as genai
from models import UserDetails
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SECRET_KEY = "RqH9CZm^!$3033A174b3mIR7^K6oY6f9%@8QG@%0Vg7LhrWVRt"  # Replace with your own secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 90
os.environ['GOOGLE_API_KEY'] = 'AIzaSyAylh6aleNQtLDKZlX1kULo54nOXQrE2wM'
genai.configure(api_key=os.environ.get('GOOGLE_API_KEY'))
ALLOWED_EXTENSIONS = {'pdf', 'jpeg'}

generation_config = {
  "temperature": 0.4,
  "top_p": 1,
  "top_k": 32,
  "max_output_tokens": 4096,
}

safety_settings = [
  {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
  {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
  {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
  {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model_ocr = genai.GenerativeModel(
    model_name="gemini-pro-vision",
    generation_config=generation_config,
    safety_settings=safety_settings,
)
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.get("/")
async def start():
    return{"message":"hello,world"}
@app.post("/login")
async def login(user_data: Login):
    try:
        user = UserDetails.objects(email=user_data.email).first()
        if not user or not pwd_context.verify(user_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Incorrect email or password")

        token_data = {
            "sub": user.username,
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        }
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        return {
            "token": token,
            "username": user.username,
            "email": user.email,
            "assignedApplications": user.assigned_applications,
            "organization":user.organization,
            "department":user.department,
            "role":user.role,
            "userPermissions":user.user_permissions,
        }

    except HTTPException as e:
        logging.error(e)
        raise e
    except Exception as e:
        logging.error(f"Error during login: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during login: {str(e)}")



@app.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...)):
    try:
        # Check if the file has an allowed extension
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="Only PDF and JPG files are allowed.")

        file_bytes = await file.read()

        pdf_io = io.BytesIO(file_bytes)

        try:
            doc = fitz.open(filename="pdf", stream=pdf_io, filetype="pdf")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error opening PDF: {str(e)}")

        prompt_parts = []
        prompt_parts.append("###Instructions###\nAs an expert OCR model, carefully analyze the answer sheet and extract the following information:\nText:\nAccurately extract all text, including headings, paragraphs, questions, and answers.\nPreserve original formatting, such as italics, bold, and underlining.\nUse bullets.\nTables:\nIdentify and parse all tables, maintaining their structure and cell contents.\nTables should be extracted as Markdown format.\nDiagrams and flowcharts:\nDescribe the visual elements of diagrams and flowcharts in a clear and concise textual format.\nInclude key components, connections, and relationships between elements.\nUse language that accurately conveys the visual information, such as \"process flows from left to right,\" \"arrows indicate direction,\" or \"different shapes represent various components.\"\n###Example###\nQuestion1\nAnswer: \n(Extracted text from the answer sheet)\n\n")
        for page_num, page in enumerate(doc):
            pix = page.get_pixmap()
            prompt_parts.append({"mime_type": "image/jpeg", "data": pix.tobytes()})

        response = model_ocr.generate_content(prompt_parts, stream=True)
        response.resolve()
        answer_sheet = ""
        answer_sheet += "\n" + response.text
        print("answer_sheet", answer_sheet)

        return {"result": response.text}

    except HTTPException as e:
        raise e
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info", timeout_keep_alive=600)
