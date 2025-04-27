# ForestGPT Flask Application
# A web-scraping chatbot for the U.S. Forest Service

from flask import Flask, request, jsonify, render_template
import requests
from bs4 import BeautifulSoup
import time
import json
import os
import re
import logging
from urllib.parse import urljoin, urlparse
import threading
import queue
import random

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration
class Config:
    # Base URLs and settings
    BASE_URL = "https://www.fs.usda.gov"
    CACHE_DIR = "cache"
    CACHE_EXPIRY = 86400  # 24 hours in seconds
    REQUEST_DELAY = 1  # Delay between requests in seconds
    MAX_WORKERS = 3  # Maximum number of worker threads for scraping
    USER_AGENT = "Forest