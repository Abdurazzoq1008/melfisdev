import sys
import os

# Loyiha bosh katalogini yo'lga qo'shamiz
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# Vercel Serverless Function eksporti
handler = app
