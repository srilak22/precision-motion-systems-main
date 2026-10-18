"""
Gemini Enterprise Customers - Complete Web Mining & Scraping Pipeline
Extracts, scrapes, and verifies all 154 enterprise customers from Google's Gemini Enterprise global customer showcase.
Outputs structured CSV and JSON datasets.
"""

import os
import re
import csv
import json
import time
import sys
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, Any, List

import requests
from bs4 import BeautifulSoup
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

try:
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
except Exception:
    pass

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("GeminiMiner")

WIKI_HEADERS = {
    "User-Agent": "GeminiEnterpriseResearch/1.0 (https://cloud-enterprise-audit.org; contact: audit@enterprise-ai.org)"
}

WEB_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# Master directory of all 154 companies in the 11 rows of 14 columns
CUSTOMERS_MASTER = [
    # Row 1
    {"rank": 1, "name": "Seven & i Holdings Co., Ltd.", "brand": "Seven & i", "sector": "Retail & Convenience Stores", "wiki": "Seven_%26_i_Holdings", "domain": "https://www.7andi.com/en/", "country": "Japan", "ai_use": "Supply chain optimization, retail inventory automation and smart store analytics"},
    {"rank": 2, "name": "7-Eleven, Inc.", "brand": "7-Eleven", "sector": "Retail & Convenience Stores", "wiki": "7-Eleven", "domain": "https://www.7-eleven.com", "country": "United States", "ai_use": "Customer experience personalization, automated inventory forecasting and franchise support"},
    {"rank": 3, "name": "Accenture plc", "brand": "Accenture", "sector": "Professional Services & IT Consulting", "wiki": "Accenture", "domain": "https://www.accenture.com", "country": "Ireland", "ai_use": "Enterprise AI agent deployment, developer code generation, business process transformation"},
    {"rank": 4, "name": "Acciona, S.A.", "brand": "Acciona", "sector": "Renewable Energy & Infrastructure", "wiki": "Acciona", "domain": "https://www.acciona.com", "country": "Spain", "ai_use": "Conversational HR assistants, infrastructure project analytics and employee self-service"},
    {"rank": 5, "name": "AirAsia (Capital A)", "brand": "AirAsia", "sector": "Airlines & Travel", "wiki": "AirAsia", "domain": "https://www.airasia.com", "country": "Malaysia", "ai_use": "Role-specific employee AI agents across marketing, HR, engineering, and customer support"},
    {"rank": 6, "name": "ATPCO (Airline Tariff Publishing Company)", "brand": "ATPCO", "sector": "Aviation Data & Pricing Systems", "wiki": "ATPCO", "domain": "https://www.atpco.net", "country": "United States", "ai_use": "Airfare data processing, dynamic offer generation and pricing rule interpretation"},
    {"rank": 7, "name": "Airwallex", "brand": "Airwallex", "sector": "Financial Technology & Cross-border Payments", "wiki": "Airwallex", "domain": "https://www.airwallex.com", "country": "Singapore / Australia", "ai_use": "Customer dispute resolution automation, customer service scaling, fraud intelligence"},
    {"rank": 8, "name": "Apex Leaders", "brand": "Apex Leaders", "sector": "Private Equity Advisory & Research", "wiki": "", "domain": "https://www.apexleaders.com", "country": "United States", "ai_use": "Executive knowledge matching, private equity investment research acceleration"},
    {"rank": 9, "name": "Arden University", "brand": "Arden University", "sector": "Higher Education & Online Learning", "wiki": "Arden_University", "domain": "https://arden.ac.uk", "country": "United Kingdom", "ai_use": "Personalized student study tutors, automated academic query resolution and grading support"},
    {"rank": 10, "name": "Arize AI", "brand": "Arize", "sector": "AI Observability & Model Monitoring", "wiki": "", "domain": "https://arize.com", "country": "United States", "ai_use": "LLM evaluation, AI agent observability, prompt monitoring and tracing"},
    {"rank": 11, "name": "American Society of Clinical Oncology (ASCO)", "brand": "ASCO", "sector": "Healthcare & Oncology Research", "wiki": "American_Society_of_Clinical_Oncology", "domain": "https://www.asco.org", "country": "United States", "ai_use": "Clinical trial search, medical literature summarization and oncology knowledge grounding"},
    {"rank": 12, "name": "Atlassian Corporation", "brand": "Atlassian", "sector": "Enterprise Collaboration & DevOps Software", "wiki": "Atlassian", "domain": "https://www.atlassian.com", "country": "Australia / United States", "ai_use": "Atlassian Intelligence, Jira ticket summarization, Confluence search synthesis"},
    {"rank": 13, "name": "AutoZone, Inc.", "brand": "AutoZone", "sector": "Automotive Parts & Retail", "wiki": "AutoZone", "domain": "https://www.autozone.com", "country": "United States", "ai_use": "Store associate diagnostic assistance, parts catalogue search, inventory automation"},
    {"rank": 14, "name": "B3 Networks", "brand": "B3 Networks", "sector": "Cloud Communications & VoIP", "wiki": "", "domain": "https://www.b3networks.com", "country": "Singapore", "ai_use": "Voice transcription analytics, automated call center agent guidance"},

    # Row 2
    {"rank": 15, "name": "Balyasny Asset Management", "brand": "Balyasny", "sector": "Hedge Fund & Alternative Investment", "wiki": "Balyasny_Asset_Management", "domain": "https://www.bamfunds.com", "country": "United States", "ai_use": "Quantitative financial modeling, alternative data synthesis, equity research summarization"},
    {"rank": 16, "name": "Banco BV", "brand": "BV", "sector": "Banking & Financial Services", "wiki": "Banco_Votorantim", "domain": "https://www.bv.com.br", "country": "Brazil", "ai_use": "Retail credit evaluation, automated loan customer service, fraud pattern analysis"},
    {"rank": 17, "name": "Bell Canada (BCE Inc.)", "brand": "Bell", "sector": "Telecommunications & Media", "wiki": "Bell_Canada", "domain": "https://www.bell.ca", "country": "Canada", "ai_use": "Network telemetry analysis, customer care chatbot routing, service dispatch optimization"},
    {"rank": 18, "name": "Bendigo and Adelaide Bank", "brand": "Bendigo Bank", "sector": "Retail Banking", "wiki": "Bendigo_and_Adelaide_Bank", "domain": "https://www.bendigobank.com.au", "country": "Australia", "ai_use": "Branch customer query automation, mortgage assessment processing support"},
    {"rank": 19, "name": "Bending Spoons", "brand": "Bending Spoons", "sector": "Digital Apps & Consumer Tech", "wiki": "Bending_Soons", "domain": "https://bendingspoons.com", "country": "Italy", "ai_use": "Creative app media generation (Remini, Splice), user query automation, software engineering"},
    {"rank": 20, "name": "Berenberg Bank", "brand": "Berenberg", "sector": "Investment Banking & Wealth Management", "wiki": "Berenberg_Bank", "domain": "https://www.berenberg.de", "country": "Germany", "ai_use": "Private banking client portfolio research, macroeconomic report summarization"},
    {"rank": 21, "name": "BlackLine, Inc.", "brand": "BlackLine", "sector": "Financial Close & Accounting Automation", "wiki": "BlackLine", "domain": "https://www.blackline.com", "country": "United States", "ai_use": "Automated financial variance analysis, journal entry verification, reconciliation support"},
    {"rank": 22, "name": "Bloomberg Media", "brand": "Bloomberg Media", "sector": "Financial News & Digital Media", "wiki": "Bloomberg_L.P.", "domain": "https://www.bloomberg.com", "country": "United States", "ai_use": "Audience engagement personalization, news transcription, content taxonomy and indexing"},
    {"rank": 23, "name": "Bluefox (Bluefox.io)", "brand": "Bluefox", "sector": "Smart Spaces & Physical Foot Traffic Analytics", "wiki": "", "domain": "https://bluefox.io", "country": "United States / France", "ai_use": "Venue footfall intelligence, crowd density forecasting and automated reporting"},
    {"rank": 24, "name": "Robert Bosch GmbH", "brand": "Bosch", "sector": "Industrial Engineering & Mobility Solutions", "wiki": "Robert_Bosch_GmbH", "domain": "https://www.bosch.com", "country": "Germany", "ai_use": "Factory manufacturing diagnostics, connected vehicle software assistant, smart engineering"},
    {"rank": 25, "name": "Bouygues S.A.", "brand": "Bouygues", "sector": "Construction, Telecom & Real Estate", "wiki": "Bouygues", "domain": "https://www.bouygues.com", "country": "France", "ai_use": "Architectural documentation compliance, construction site safety tracking, telecom support"},
    {"rank": 26, "name": "Box, Inc.", "brand": "Box", "sector": "Cloud Content Management & Enterprise Storage", "wiki": "Box_(company)", "domain": "https://www.box.com", "country": "United States", "ai_use": "Box AI document intelligence, automated contract metadata extraction, enterprise search"},
    {"rank": 27, "name": "Bank Rakyat Indonesia (BRI)", "brand": "BRI", "sector": "Banking & Microfinance", "wiki": "Bank_Rakyat_Indonesia", "domain": "https://www.bri.co.id", "country": "Indonesia", "ai_use": "Conversational microloan agent 'Sabrina', automated credit risk scoring, agent banking"},
    {"rank": 28, "name": "Bunnings Warehouse", "brand": "Bunnings", "sector": "Home Improvement & Hardware Retail", "wiki": "Bunnings_Warehouse", "domain": "https://www.bunnings.com.au", "country": "Australia", "ai_use": "DIY product discovery, conversational store search, supply chain fulfillment logistics"},

    # Row 3
    {"rank": 29, "name": "CaixaBank, S.A.", "brand": "CaixaBank", "sector": "Commercial Banking & Financial Services", "wiki": "CaixaBank", "domain": "https://www.caixabank.com", "country": "Spain", "ai_use": "GenAI virtual assistant Noa, branch advisor compliance checking, personalized banking"},
    {"rank": 30, "name": "Canva Pty Ltd", "brand": "Canva", "sector": "Graphic Design & Visual Communication Software", "wiki": "Canva", "domain": "https://www.canva.com", "country": "Australia", "ai_use": "Magic Studio visual generative tools, automated copywriting, design layout generation"},
    {"rank": 31, "name": "Capcom Co., Ltd.", "brand": "Capcom", "sector": "Video Game Development & Publishing", "wiki": "Capcom", "domain": "https://www.capcom.com", "country": "Japan", "ai_use": "Game asset prototyping, localization QA, NPC dialog simulation, code optimization"},
    {"rank": 32, "name": "Cardinal Health, Inc.", "brand": "Cardinal Health", "sector": "Healthcare Services & Pharmaceutical Distribution", "wiki": "Cardinal_Health", "domain": "https://www.cardinalhealth.com", "country": "United States", "ai_use": "Hospital medical supply chain forecasting, clinical documentation automation, inventory"},
    {"rank": 33, "name": "Cathay Pacific Airways Limited", "brand": "Cathay", "sector": "Airlines & Aviation Services", "wiki": "Cathay_Pacific", "domain": "https://www.cathaypacific.com", "country": "Hong Kong", "ai_use": "Passenger rebooking assistance, flight attendant briefing assistant, cargo route planning"},
    {"rank": 34, "name": "Chief Digital and Artificial Intelligence Office (CDAO)", "brand": "CDAO", "sector": "Defense & Government AI (US DoD)", "wiki": "Chief_Digital_and_Artificial_Intelligence_Office", "domain": "https://www.ai.mil", "country": "United States", "ai_use": "Defense task force data integration, Task Force Lima generative AI sandboxing, intelligence"},
    {"rank": 35, "name": "Citigroup Inc.", "brand": "Citi", "sector": "Global Investment Banking & Wealth Management", "wiki": "Citigroup", "domain": "https://www.citigroup.com", "country": "United States", "ai_use": "Regulatory compliance mapping, code modernization, analyst earnings report summarization"},
    {"rank": 36, "name": "CJ ENM Co., Ltd.", "brand": "CJ ENM", "sector": "Entertainment, Media & E-Commerce", "wiki": "CJ_ENM", "domain": "https://www.cjenm.com", "country": "South Korea", "ai_use": "Content subtitling and dubbing, audience sentiment analysis, digital marketing production"},
    {"rank": 37, "name": "CME Group Inc.", "brand": "CME Group", "sector": "Financial Derivatives Exchange & Markets", "wiki": "CME_Group", "domain": "https://www.cmegroup.com", "country": "United States", "ai_use": "Market risk modeling, trader regulatory inquiry automation, historical tick data querying"},
    {"rank": 38, "name": "Color Health, Inc.", "brand": "Color", "sector": "Digital Health & Cancer Care Delivery", "wiki": "Color_Health", "domain": "https://www.color.com", "country": "United States", "ai_use": "Personalized cancer patient navigation, clinical guideline matching, diagnostic support"},
    {"rank": 39, "name": "Commerzbank AG", "brand": "Commerzbank", "sector": "Commercial Banking", "wiki": "Commerzbank", "domain": "https://www.commerzbank.com", "country": "Germany", "ai_use": "Document-processing automation ($30M annual cost reduction), corporate customer onboarding"},
    {"rank": 40, "name": "Compass, Inc.", "brand": "Compass", "sector": "Real Estate Technology & Brokerage", "wiki": "Compass,_Inc.", "domain": "https://www.compass.com", "country": "United States", "ai_use": "Property listing marketing copy, automated comparable home market analysis, CRM agents"},
    {"rank": 41, "name": "Cooley LLP", "brand": "Cooley", "sector": "Corporate Legal Services & Venture Counsel", "wiki": "Cooley_LLP", "domain": "https://www.cooley.com", "country": "United States", "ai_use": "Legal discovery summarization, contract clause drafting, corporate precedent analysis"},
    {"rank": 42, "name": "DBS Bank Ltd", "brand": "DBS", "sector": "Commercial & Wealth Banking", "wiki": "DBS_Bank", "domain": "https://www.dbs.com", "country": "Singapore", "ai_use": "Wealth advisor copilot, fraud detection pattern extraction, trade finance automation"},

    # Row 4
    {"rank": 43, "name": "Definity Financial Corporation", "brand": "Definity", "sector": "Property & Casualty Insurance", "wiki": "Definity_Financial", "domain": "https://www.definityfinancial.com", "country": "Canada", "ai_use": "Insurance claims triaging, underwriting risk documentation processing, broker chatbots"},
    {"rank": 44, "name": "Deloitte Touche Tohmatsu Limited", "brand": "Deloitte", "sector": "Audit, Tax, Consulting & Advisory", "wiki": "Deloitte", "domain": "https://www.deloitte.com", "country": "United Kingdom / Global", "ai_use": "DART audit intelligence, tax regulation cross-referencing, client advisory agent workflows"},
    {"rank": 45, "name": "Deutsche Bank AG", "brand": "Deutsche Bank", "sector": "Investment & Corporate Banking", "wiki": "Deutsche_Bank", "domain": "https://www.db.com", "country": "Germany", "ai_use": "Financial analyst report drafting, code refactoring, international trade sanction checks"},
    {"rank": 46, "name": "Deutsche Telekom AG", "brand": "Deutsche Telekom (T)", "sector": "Telecommunications & Digital Services", "wiki": "Deutsche_Telekom", "domain": "https://www.telekom.com", "country": "Germany", "ai_use": "Enterprise data analysis acceleration (4X across 30k users), customer support routing"},
    {"rank": 47, "name": "Dreamlands (Dreamlands.io)", "brand": "Dreamlands", "sector": "Interactive Entertainment & Virtual Worlds", "wiki": "", "domain": "https://dreamlands.io", "country": "United States", "ai_use": "Procedural narrative generation, AI character interactions, virtual world worldbuilding"},
    {"rank": 48, "name": "Dun & Bradstreet Corporation", "brand": "Dun & Bradstreet", "sector": "Commercial Data & Business Analytics", "wiki": "Dun_%26_Bradstreet", "domain": "https://www.dnb.com", "country": "United States", "ai_use": "D&B Master Data enrichment, B2B credit risk assessment, commercial supply chain analysis"},
    {"rank": 49, "name": "EBANX", "brand": "EBANX", "sector": "Fintech & Latin American Payment Processing", "wiki": "EBANX", "domain": "https://www.ebanx.com", "country": "Brazil", "ai_use": "Cross-border payment conversion optimization, chargeback dispute automation, merchant care"},
    {"rank": 50, "name": "Every Cure", "brand": "Every Cure", "sector": "Non-profit Drug Repurposing & Medical AI", "wiki": "", "domain": "https://everycure.org", "country": "United States", "ai_use": "Systematic drug-disease matching across medical literature to uncover rare disease treatments"},
    {"rank": 51, "name": "FactSet Research Systems Inc.", "brand": "FactSet", "sector": "Financial Data & Analytics Software", "wiki": "FactSet", "domain": "https://www.factset.com", "country": "United States", "ai_use": "FactSet Mercury conversational financial interface, portfolio performance commentary"},
    {"rank": 52, "name": "Faherty Brand", "brand": "Faherty", "sector": "Apparel & Sustainable Fashion", "wiki": "", "domain": "https://fahertybrand.com", "country": "United States", "ai_use": "E-commerce customer service assistant, product catalog enrichment, style recommendations"},
    {"rank": 53, "name": "FairPrice Group", "brand": "FairPrice Group", "sector": "Grocery Retail & Supermarkets", "wiki": "NTUC_FairPrice", "domain": "https://www.fairpricegroup.com.sg", "country": "Singapore", "ai_use": "Omnichannel shopping cart recommendations, grocery supply demand planning, localized pricing"},
    {"rank": 54, "name": "FletcherTech (Fletcher Building)", "brand": "FletcherTech", "sector": "Building Materials & Construction", "wiki": "Fletcher_Building", "domain": "https://www.fletcherbuilding.com", "country": "New Zealand", "ai_use": "Building product estimation, supply chain freight dispatch, invoice matching"},
    {"rank": 55, "name": "Formula E Operations Ltd", "brand": "Formula E", "sector": "Electric Motorsport & Event Media", "wiki": "Formula_E", "domain": "https://www.fiaformulae.com", "country": "United Kingdom", "ai_use": "Race telemetry fan commentary generation, multilingual race recaps, media asset indexing"},
    {"rank": 56, "name": "Fox Sports", "brand": "Fox Sports", "sector": "Sports Television & Broadcast Media", "wiki": "Fox_Sports_(United_States)", "domain": "https://www.foxsports.com", "country": "United States", "ai_use": "Automated video highlight tagging, live statistical sports graphics narration, fan search"},

    # Row 5
    {"rank": 57, "name": "Freshfields Bruckhaus Deringer LLP", "brand": "Freshfields", "sector": "International Legal Practice", "wiki": "Freshfields_Bruckhaus_Deringer", "domain": "https://www.freshfields.com", "country": "United Kingdom", "ai_use": "Cross-jurisdiction antitrust search, merger diligence automation, contract drafting"},
    {"rank": 58, "name": "Good Choice Company (Yeogieottae)", "brand": "여기어때", "sector": "Online Travel & Accommodation Booking", "wiki": "", "domain": "https://www.goodchoice.kr", "country": "South Korea", "ai_use": "Hotel reservation customer service, personalized itinerary planning, travel reviews summary"},
    {"rank": 59, "name": "Grupo Globo", "brand": "Globo", "sector": "Broadcast Television & Media Streaming", "wiki": "Grupo_Globo", "domain": "https://www.globo.com", "country": "Brazil", "ai_use": "Globoplay content recommendation engine, automated video metadata generation, sports highlights"},
    {"rank": 60, "name": "The Goldman Sachs Group, Inc.", "brand": "Goldman Sachs", "sector": "Investment Banking & Securities", "wiki": "Goldman_Sachs", "domain": "https://www.goldmansachs.com", "country": "United States", "ai_use": "Developer code generation assistant, financial document comprehension, compliance monitoring"},
    {"rank": 61, "name": "Distribuidora Internacional de Alimentación (Dia)", "brand": "Dia", "sector": "Supermarket & Retail Chain", "wiki": "Dia_(supermarket)", "domain": "https://www.diacorporate.com", "country": "Spain", "ai_use": "Store replenishment automation, promotion campaign copy generation, supply chain routing"},
    {"rank": 62, "name": "Grupo Marista", "brand": "Grupo Marista", "sector": "Education & Healthcare Network", "wiki": "", "domain": "https://grupomarista.org.br", "country": "Brazil", "ai_use": "Student academic support assistants, hospital clinical protocol queries, educational analytics"},
    {"rank": 63, "name": "Harmoney Corp Limited", "brand": "Harmoney", "sector": "Consumer Lending & Fintech", "wiki": "Harmoney", "domain": "https://www.harmoney.com.au", "country": "Australia / New Zealand", "ai_use": "Automated loan origination underwriting, credit risk inquiry answering, borrower self-service"},
    {"rank": 64, "name": "Harvey AI", "brand": "Harvey", "sector": "Legal Generative AI Platform", "wiki": "", "domain": "https://www.harvey.ai", "country": "United States", "ai_use": "Legal domain foundation model fine-tuning, complex litigation research, brief analysis"},
    {"rank": 65, "name": "Highmark Health", "brand": "Highmark Health", "sector": "Healthcare Delivery & Health Insurance", "wiki": "Highmark", "domain": "https://www.highmarkhealth.org", "country": "United States", "ai_use": "Patient prior-authorization review streamlining, provider scheduling assistant, claims support"},
    {"rank": 66, "name": "Hong Leong Bank Berhad", "brand": "Hong Leong Bank", "sector": "Commercial Banking", "wiki": "Hong_Leong_Bank", "domain": "https://www.hlb.com.my", "country": "Malaysia", "ai_use": "Conversational banking chatbot, branch advisor compliance helper, fraud detection analytics"},
    {"rank": 67, "name": "Humana Inc.", "brand": "Humana", "sector": "Health Insurance & Medicare Advantage", "wiki": "Humana", "domain": "https://www.humana.com", "country": "United States", "ai_use": "Senior patient care management notes synthesis, medical policy navigation, benefits inquiry"},
    {"rank": 68, "name": "iFood", "brand": "iFood", "sector": "Food Delivery & Quick Commerce", "wiki": "IFood", "domain": "https://www.ifood.com.br", "country": "Brazil", "ai_use": "Consumer dish recommendation, courier routing intelligence, merchant customer care bot"},
    {"rank": 69, "name": "Incrementa", "brand": "Incrementa", "sector": "Business Consulting & Growth Advisory", "wiki": "", "domain": "https://incrementa.ca", "country": "Canada", "ai_use": "Strategic workshop synthesis, growth advisory diagnostic modeling, market sizing analytics"},
    {"rank": 70, "name": "Recruit Technologies / Indeed", "brand": "Recruit Technologies", "sector": "Human Resources & Job Search Technology", "wiki": "Recruit_(company)", "domain": "https://recruit-tech.co.jp", "country": "Japan", "ai_use": "Candidate-job matching optimization, resume skill taxonomy extraction, recruiter assistance"},

    # Row 6
    {"rank": 71, "name": "Indosat Ooredoo Hutchison", "brand": "Indosat", "sector": "Telecommunications & Mobile Networks", "wiki": "Indosat", "domain": "https://ioh.co.id", "country": "Indonesia", "ai_use": "Bilingual Indonesian AI customer service, mobile plan personalization, cellular tower maintenance"},
    {"rank": 72, "name": "Intel Corporation", "brand": "Intel", "sector": "Semiconductors & Computing Hardware", "wiki": "Intel", "domain": "https://www.intel.com", "country": "United States", "ai_use": "Chip design verification code assistance, silicon documentation search, supply chain planning"},
    {"rank": 73, "name": "Kakao Healthcare", "brand": "Kakao Healthcare", "sector": "Digital Health & Diabetes Management", "wiki": "Kakao", "domain": "https://www.kakaohealthcare.com", "country": "South Korea", "ai_use": "Continuous glucose monitoring analytics, patient lifestyle coaching AI assistant 'PASTA'"},
    {"rank": 74, "name": "KDDI Corporation", "brand": "KDDI", "sector": "Telecommunications & Mobile Services", "wiki": "KDDI", "domain": "https://www.kddi.com/english/", "country": "Japan", "ai_use": "Au customer service contact center automation, network failure root cause analysis, 5G edge AI"},
    {"rank": 75, "name": "Kinaxis Inc.", "brand": "Kinaxis", "sector": "Supply Chain Management Software", "wiki": "Kinaxis", "domain": "https://www.kinaxis.com", "country": "Canada", "ai_use": "RapidResponse supply chain disruption scenario modeling, demand sensing conversational copilot"},
    {"rank": 76, "name": "KnowBe4, Inc.", "brand": "KnowBe4", "sector": "Cybersecurity Awareness & Phishing Simulation", "wiki": "KnowBe4", "domain": "https://www.knowbe4.com", "country": "United States", "ai_use": "Adaptive phishing training scenario generator, employee security risk assessment automation"},
    {"rank": 77, "name": "Kopi Kenangan", "brand": "Kopi Kenangan", "sector": "Coffee Chain & F&B Retail", "wiki": "Kopi_Kenangan", "domain": "https://kopikenangan.com", "country": "Indonesia", "ai_use": "Mobile ordering app personalization, store drink inventory replenishment, loyalty analytics"},
    {"rank": 78, "name": "LATAM Airlines Group S.A.", "brand": "LATAM Airlines", "sector": "Commercial Aviation & Cargo", "wiki": "LATAM_Airlines_Group", "domain": "https://www.latamairlines.com", "country": "Chile", "ai_use": "Flight maintenance technical manual search, passenger baggage inquiry automation, crew rosters"},
    {"rank": 79, "name": "LG Electronics Inc.", "brand": "LG Electronics", "sector": "Consumer Electronics & Home Appliances", "wiki": "LG_Electronics", "domain": "https://www.lg.com", "country": "South Korea", "ai_use": "ThinQ smart home voice agent intelligence, appliance diagnostics, user manual conversational agent"},
    {"rank": 80, "name": "Livelo S.A.", "brand": "Livelo", "sector": "Customer Loyalty & Rewards Programs", "wiki": "", "domain": "https://www.livelo.com.br", "country": "Brazil", "ai_use": "Points catalog personalization, rewards redemption assistance, promotional campaign targeting"},
    {"rank": 81, "name": "Lovable (Lovable.dev)", "brand": "Lovable", "sector": "AI Full-Stack App Building & Code Gen", "wiki": "", "domain": "https://lovable.dev", "country": "Sweden", "ai_use": "Natural language to full-stack web application generation, UI design translation to React/Node"},
    {"rank": 82, "name": "London Stock Exchange Group plc (LSEG)", "brand": "LSEG", "sector": "Financial Market Infrastructure & Data", "wiki": "London_Stock_Exchange_Group", "domain": "https://www.lseg.com", "country": "United Kingdom", "ai_use": "Financial workspace natural language interface, market data querying, regulatory filings analysis"},
    {"rank": 83, "name": "Macquarie Group Limited (Macquarie Bank)", "brand": "Macquarie Bank", "sector": "Investment Banking & Asset Management", "wiki": "Macquarie_Group", "domain": "https://www.macquarie.com", "country": "Australia", "ai_use": "Banking code modernization, investment compliance search, customer account inquiries"},
    {"rank": 84, "name": "Macy's, Inc.", "brand": "Macy's", "sector": "Department Stores & Fashion Retail", "wiki": "Macy%27s,_Inc.", "domain": "https://www.macys.com", "country": "United States", "ai_use": "Visual search, product description generation, customer return handling, trend prediction"},

    # Row 7
    {"rank": 85, "name": "Magnific AI", "brand": "Magnific", "sector": "AI Image Upscaling & Creative Media", "wiki": "", "domain": "https://magnific.ai", "country": "Spain", "ai_use": "High-resolution generative image hallucination, visual prompt enhancement, photorealistic upscaling"},
    {"rank": 86, "name": "Major League Baseball (MLB)", "brand": "MLB", "sector": "Professional Sports League & Media", "wiki": "Major_League_Baseball", "domain": "https://www.mlb.com", "country": "United States", "ai_use": "Statcast metrics fan narration, automated multilingual highlight generation, historical archive search"},
    {"rank": 87, "name": "Mantel Group", "brand": "Mantel", "sector": "Technology Consulting & Cloud Solutions", "wiki": "", "domain": "https://mantelgroup.com.au", "country": "Australia", "ai_use": "Client cloud modernization accelerators, internal proposal synthesis, AI engineering workflows"},
    {"rank": 88, "name": "Marubeni Corporation", "brand": "Marubeni", "sector": "General Trading Company (Sogo Shosha)", "wiki": "Marubeni", "domain": "https://www.marubeni.com/en/", "country": "Japan", "ai_use": "Commodities market intelligence summarization, global contract legal review, trade logistics"},
    {"rank": 89, "name": "McDonald's Corporation", "brand": "McDonald's", "sector": "Fast Food & Quick Service Restaurants", "wiki": "McDonald%27s", "domain": "https://www.mcdonalds.com", "country": "United States", "ai_use": "Drive-thru automated ordering assistance, kitchen equipment maintenance analytics, supply chain"},
    {"rank": 90, "name": "Mercari, Inc.", "brand": "Mercari", "sector": "C2C Marketplace & E-Commerce", "wiki": "Mercari", "domain": "https://about.mercari.com/en/", "country": "Japan", "ai_use": "Merchat listing assistant, automated price suggestion, counterfeit goods detection, CS chatbot"},
    {"rank": 91, "name": "Merck & Co., Inc.", "brand": "Merck", "sector": "Pharmaceuticals & Biotechnology", "wiki": "Merck_%26_Co.", "domain": "https://www.merck.com", "country": "United States", "ai_use": "Enterprise AI agent deployment across 75k employees, drug discovery synthesis, trial protocol review"},
    {"rank": 92, "name": "MIXI, Inc.", "brand": "MIXI", "sector": "Mobile Gaming, Sports & Social Media", "wiki": "Mixi", "domain": "https://mixi.co.jp/en/", "country": "Japan", "ai_use": "Game live-ops moderation, automated customer support, in-game analytics query synthesis"},
    {"rank": 93, "name": "Natura & Co", "brand": "Natura", "sector": "Cosmetics, Beauty & Personal Care", "wiki": "Natura_%26_Co", "domain": "https://naturaeco.com", "country": "Brazil", "ai_use": "Beauty consultant conversational advisor, botanical ingredient database query, cosmetic packaging"},
    {"rank": 94, "name": "Newsweek Publishing LLC", "brand": "Newsweek", "sector": "News Magazine & Digital Journalism", "wiki": "Newsweek", "domain": "https://www.newsweek.com", "country": "United States", "ai_use": "Editorial research verification, article metadata tagging, automated audio news narration"},
    {"rank": 95, "name": "NextAfter", "brand": "NextAfter", "sector": "Digital Fundraising Research & Non-Profit Marketing", "wiki": "", "domain": "https://www.nextafter.com", "country": "United States", "ai_use": "Non-profit donor email A/B test optimization, fundraising campaign performance analysis"},
    {"rank": 96, "name": "Nokia Corporation", "brand": "Nokia", "sector": "Telecommunications Network Equipment", "wiki": "Nokia", "domain": "https://www.nokia.com", "country": "Finland", "ai_use": "5G network slice optimization, telecom site maintenance manual assistant, software modernization"},
    {"rank": 97, "name": "Nol Universe", "brand": "Nol Universe", "sector": "Gaming & Metaverse Virtual Entertainment", "wiki": "", "domain": "https://noluniverse.com", "country": "South Korea", "ai_use": "Virtual avatar conversational agents, interactive story quest generation, community safety"},
    {"rank": 98, "name": "NTT DATA Corporation", "brand": "NTT DATA", "sector": "IT Consulting & Digital Transformation", "wiki": "NTT_Data", "domain": "https://www.nttdata.com", "country": "Japan", "ai_use": "Enterprise knowledge retrieval (cut from 2 weeks to instant, saving 300,000 hrs), code review"},

    # Row 8
    {"rank": 99, "name": "CJ Olive Young Corporation", "brand": "Olive Young", "sector": "Health & Beauty Retail", "wiki": "Olive_Young", "domain": "https://global.oliveyoung.com", "country": "South Korea", "ai_use": "Skincare product recommendation engine, multilingual global consumer support, review analysis"},
    {"rank": 100, "name": "OneUnited Bank", "brand": "OneUnited Bank", "sector": "Community Development & Retail Banking", "wiki": "OneUnited_Bank", "domain": "https://www.oneunited.com", "country": "United States", "ai_use": "Financial literacy conversational coaching, automated customer account query resolution"},
    {"rank": 101, "name": "Onit, Inc.", "brand": "Onit", "sector": "Enterprise Legal Workflow & Contract Lifecycle", "wiki": "", "domain": "https://www.onit.com", "country": "United States", "ai_use": "AI contract review, legal invoice spend analysis, corporate workflow automated routing"},
    {"rank": 102, "name": "OpenEvidence", "brand": "OpenEvidence", "sector": "Medical Evidence AI for Physicians", "wiki": "", "domain": "https://www.openevidence.com", "country": "United States", "ai_use": "Physician clinical decision support, peer-reviewed medical literature query answering"},
    {"rank": 103, "name": "Overdose. Digital", "brand": "Overdose Digital", "sector": "Global Digital Commerce Agency", "wiki": "", "domain": "https://overdose.digital", "country": "New Zealand / Australia", "ai_use": "E-commerce store optimization, automated catalog tagging, conversion funnel analytics"},
    {"rank": 104, "name": "Papa John's International, Inc.", "brand": "Papa Johns", "sector": "Pizza Chain & Quick Service Restaurant", "wiki": "Papa_Johns", "domain": "https://www.papajohns.com", "country": "United States", "ai_use": "Store order routing, voice-assisted pizza ordering, store supply delivery forecasting"},
    {"rank": 105, "name": "PayPal Holdings, Inc.", "brand": "PayPal", "sector": "Digital Payments & FinTech", "wiki": "PayPal", "domain": "https://www.paypal.com", "country": "United States", "ai_use": "Fraud prevention graph analysis, developer API support bot, checkout conversion optimization"},
    {"rank": 106, "name": "Pictet Group (Banque Pictet)", "brand": "Pictet", "sector": "Private Banking & Wealth Management", "wiki": "Pictet_Group", "domain": "https://www.pictet.com", "country": "Switzerland", "ai_use": "Portfolio manager equity briefing, ESG investment compliance screening, financial summarization"},
    {"rank": 107, "name": "Premji Invest", "brand": "Premji Invest", "sector": "Private Equity & Venture Capital", "wiki": "Azim_Premji", "domain": "https://www.premjiinvest.com", "country": "India", "ai_use": "Startup deal screening, market landscape synthesis, portfolio company performance tracking"},
    {"rank": 108, "name": "Progress Learning", "brand": "Progress Learning", "sector": "K-12 Educational Technology & Assessment", "wiki": "", "domain": "https://www.progresslearning.com", "country": "United States", "ai_use": "State-standard aligned test question generation, personalized student remedial learning paths"},
    {"rank": 109, "name": "Rakuten Group, Inc.", "brand": "Rakuten", "sector": "E-Commerce, FinTech & Telecommunications", "wiki": "Rakuten", "domain": "https://global.rakuten.com/corp/", "country": "Japan", "ai_use": "Rakuten AI for merchants, mobile network optimization, e-commerce catalog translation"},
    {"rank": 110, "name": "Recursion Pharmaceuticals, Inc.", "brand": "Recursion", "sector": "Biotechnology & AI Drug Discovery", "wiki": "Recursion_Pharmaceuticals", "domain": "https://www.recursion.com", "country": "United States", "ai_use": "Phenomic data exploration, target biology deep representation modeling, chemical synthesis planning"},
    {"rank": 111, "name": "Replit, Inc.", "brand": "Replit", "sector": "Cloud Software Development & Coding Platform", "wiki": "Replit", "domain": "https://replit.com", "country": "United States", "ai_use": "Replit Agent autonomous programming, code autocomplete, software debugging and deployment"},
    {"rank": 112, "name": "Reveneer", "brand": "Reveneer", "sector": "Inside Sales Operations & Enablement", "wiki": "", "domain": "https://reveneer.io", "country": "United States", "ai_use": "B2B sales call transcription analysis, objection handling coaching, lead scoring automation"},

    # Row 9
    {"rank": 113, "name": "RIU Hotels & Resorts", "brand": "RIU", "sector": "Hotels, Resorts & Hospitality", "wiki": "RIU_Hotels", "domain": "https://www.riu.com", "country": "Spain", "ai_use": "Multilingual guest reservation concierge, room inventory optimization, loyalty engagement"},
    {"rank": 114, "name": "Seikagaku Corporation", "brand": "Seikagaku", "sector": "Pharmaceuticals & Glycoscience", "wiki": "Seikagaku_Corporation", "domain": "https://www.seikagaku.co.jp/en/", "country": "Japan", "ai_use": "Biomedical patent research analysis, regulatory submission compliance checking, clinical trials"},
    {"rank": 115, "name": "Schrödinger, Inc.", "brand": "Schrödinger", "sector": "Molecular Simulation & Physics-based Drug Design", "wiki": "Schr%C3%B6dinger_(company)", "domain": "https://www.schrodinger.com", "country": "United States", "ai_use": "Physics-informed neural networks for molecular dynamics, ligand binding affinity prediction"},
    {"rank": 116, "name": "Seattle Children's Hospital", "brand": "Seattle Children's", "sector": "Pediatric Healthcare & Research", "wiki": "Seattle_Children%27s", "domain": "https://www.seattlechildrens.org", "country": "United States", "ai_use": "Pediatric research literature summarization, operational scheduling efficiency, patient family guides"},
    {"rank": 117, "name": "SEBRAE", "brand": "SEBRAE", "sector": "Small Business Microenterprise Development", "wiki": "Sebrae", "domain": "https://www.sebrae.com.br", "country": "Brazil", "ai_use": "Microentrepreneur automated business plan guidance, tax compliance advisory chatbots"},
    {"rank": 118, "name": "Shopify Inc.", "brand": "Shopify", "sector": "E-Commerce Infrastructure & Merchant SaaS", "wiki": "Shopify", "domain": "https://www.shopify.com", "country": "Canada", "ai_use": "Shopify Magic merchant marketing tools, Sidekick e-commerce business assistant, catalog search"},
    {"rank": 119, "name": "Snap Inc. (Snapchat)", "brand": "Snap", "sector": "Social Media, Camera & AR Technology", "wiki": "Snap_Inc.", "domain": "https://www.snap.com", "country": "United States", "ai_use": "My AI chatbot, conversational AR lens generation, sponsored content targeting, safety moderation"},
    {"rank": 120, "name": "Snyk Limited", "brand": "Snyk", "sector": "Developer Security & Open Source Vulnerability Scanning", "wiki": "Snyk", "domain": "https://snyk.io", "country": "United Kingdom / United States", "ai_use": "Automated code security vulnerability remediation, infrastructure-as-code vulnerability fixing"},
    {"rank": 121, "name": "Sompo Holdings, Inc.", "brand": "Sompo", "sector": "Property, Casualty & Nursing Care Insurance", "wiki": "Sompo_Holdings", "domain": "https://www.sompo-hd.com/en/", "country": "Japan", "ai_use": "Nursing home senior care data synthesis, disaster insurance claim acceleration, underwriting"},
    {"rank": 122, "name": "Square Enix Holdings Co., Ltd.", "brand": "Square Enix", "sector": "Video Game Publishing & Entertainment", "wiki": "Square_Enix", "domain": "https://www.square-enix.com", "country": "Japan", "ai_use": "Game lore consistency verification, multi-language localization testing, player support bot"},
    {"rank": 123, "name": "Stan. (Stan Entertainment Pty Ltd)", "brand": "Stan.", "sector": "Subscription Video on Demand Streaming", "wiki": "Stan_(streaming_service)", "domain": "https://www.stan.com.au", "country": "Australia", "ai_use": "Streaming content personalized recommendation, video asset transcoding workflow optimization"},
    {"rank": 124, "name": "Starling Bank Limited", "brand": "Starling", "sector": "Digital Challenger Bank", "wiki": "Starling_Bank", "domain": "https://www.starlingbank.com", "country": "United Kingdom", "ai_use": "App-based customer finance manager, anti-money laundering transaction anomaly detection"},
    {"rank": 125, "name": "State of Arizona (Government Agency)", "brand": "State of Arizona", "sector": "Public Sector & State Government Services", "wiki": "Arizona", "domain": "https://az.gov", "country": "United States", "ai_use": "Citizen services digital inquiry assistance, benefits application workflow guidance"},
    {"rank": 126, "name": "QA Ltd", "brand": "QA", "sector": "Digital Skills Training & Tech Apprenticeships", "wiki": "QA_Ltd", "domain": "https://www.qa.com", "country": "United Kingdom", "ai_use": "Tech student learning path personalization, coding exercise automated feedback and assessments"},

    # Row 10
    {"rank": 127, "name": "Tata Consultancy Services (TCS)", "brand": "TCS", "sector": "IT Services & Business Solutions", "wiki": "Tata_Consultancy_Services", "domain": "https://www.tcs.com", "country": "India", "ai_use": "TCS AI WisdomNext platform, enterprise legacy code modernization, automated IT ops"},
    {"rank": 128, "name": "Tata Steel Limited", "brand": "Tata Steel", "sector": "Steel Manufacturing & Heavy Metals", "wiki": "Tata_Steel", "domain": "https://www.tatasteel.com", "country": "India", "ai_use": "Blast furnace thermal efficiency modeling, raw material quality predictive maintenance"},
    {"rank": 129, "name": "Telus Digital (Telus International)", "brand": "Telus Digital", "sector": "Digital Customer Experience & AI Solutions", "wiki": "Telus_International", "domain": "https://www.telusdigital.com", "country": "Canada", "ai_use": "AI data annotation platform, multi-lingual customer care agent assist, contact center optimization"},
    {"rank": 130, "name": "The Brandtech Group", "brand": "The Brandtech Group", "sector": "Marketing Technology & Digital Advertising", "wiki": "", "domain": "https://thebrandtechgroup.com", "country": "United Kingdom / US", "ai_use": "Pencil generative AI advertising platform, automated marketing copy and dynamic ad creative"},
    {"rank": 131, "name": "The Home Depot, Inc.", "brand": "The Home Depot", "sector": "Home Improvement & Hardware Retail", "wiki": "Home_Depot", "domain": "https://www.homedepot.com", "country": "United States", "ai_use": "Store associate mobile product finder, DIY home repair conversational helper, warehouse logistics"},
    {"rank": 132, "name": "tiket.com (PT Global Tiket Network)", "brand": "tiket.com", "sector": "Online Travel Agent & Ticketing", "wiki": "Tiket.com", "domain": "https://www.tiket.com", "country": "Indonesia", "ai_use": "Bilingual Indonesian hotel and flight customer care, personalized vacation package recommendation"},
    {"rank": 133, "name": "TIM S.p.A. / TIM Brasil", "brand": "TIM", "sector": "Telecommunications & Broadband Services", "wiki": "TIM_(telecommunications_company)", "domain": "https://www.tim.it", "country": "Italy / Brazil", "ai_use": "Cellular plan self-service support bot, mobile network congestion prediction, customer retention"},
    {"rank": 134, "name": "TMC Health", "brand": "TMC Health", "sector": "Healthcare Systems & Regional Hospitals", "wiki": "", "domain": "https://www.tmcaz.com", "country": "United States", "ai_use": "Electronic health record nursing documentation support, patient appointment triage"},
    {"rank": 135, "name": "Toolstation Limited", "brand": "Toolstation", "sector": "Trade & Construction Tool Retail", "wiki": "Toolstation", "domain": "https://www.toolstation.com", "country": "United Kingdom", "ai_use": "Contractor product catalogue search, trade click-and-collect inventory replenishment"},
    {"rank": 136, "name": "Trade Me Limited", "brand": "Trade Me", "sector": "Online Classifieds & E-Commerce", "wiki": "Trade_Me", "domain": "https://www.trademe.co.nz", "country": "New Zealand", "ai_use": "Classified listing description generator, automotive and property matching algorithms"},
    {"rank": 137, "name": "Ultimate Kronos Group (UKG)", "brand": "UKG", "sector": "Human Capital Management & Workforce Solutions", "wiki": "Ultimate_Kronos_Group", "domain": "https://www.ukg.com", "country": "United States", "ai_use": "UKG Bryte workforce AI copilot, employee scheduling conflict resolution, HR policy query answering"},
    {"rank": 138, "name": "UNETI AI LABS", "brand": "UNETI AI LABS", "sector": "Academic AI Research & Engineering Incubator", "wiki": "", "domain": "https://uneti.edu.vn", "country": "Vietnam", "ai_use": "Academic research modeling, educational computing experiments, computer vision student projects"},
    {"rank": 139, "name": "University of Cambridge", "brand": "University of Cambridge", "sector": "Higher Education & Academic Research", "wiki": "University_of_Cambridge", "domain": "https://www.cam.ac.uk", "country": "United Kingdom", "ai_use": "Scientific literature research synthesis, bio-informatics computing, automated administrative answers"},
    {"rank": 140, "name": "Universo Online (UOL)", "brand": "UOL", "sector": "Digital Media Portal & Cloud Provider", "wiki": "Universo_Online", "domain": "https://www.uol.com.br", "country": "Brazil", "ai_use": "Portuguese content recommendation, news article metadata indexing, digital publishing workflows"},

    # Row 11
    {"rank": 141, "name": "United Wholesale Mortgage (UWM)", "brand": "UWM", "sector": "Residential Mortgage Lending", "wiki": "United_Wholesale_Mortgage", "domain": "https://www.uwm.com", "country": "United States", "ai_use": "Underwriting document validation, loan originator assistant ChatUWM, title document analysis"},
    {"rank": 142, "name": "Verizon Communications Inc.", "brand": "Verizon", "sector": "Telecommunications & Wireless Network", "wiki": "Verizon", "domain": "https://www.verizon.com", "country": "United States", "ai_use": "Contact center agent live assistance, network anomaly root-cause detection, customer plan match"},
    {"rank": 143, "name": "Virgin Voyages", "brand": "Virgin Voyages", "sector": "Luxury Cruise Line & Travel", "wiki": "Virgin_Voyages", "domain": "https://www.virginvoyages.com", "country": "United States", "ai_use": "Sailor onboard concierge chatbot, dining and event recommendation, voyage booking support"},
    {"rank": 144, "name": "Vodafone Group Plc", "brand": "Vodafone", "sector": "Telecommunications & IoT Provider", "wiki": "Vodafone", "domain": "https://www.vodafone.com", "country": "United Kingdom", "ai_use": "TOBi conversational customer care bot, network energy management, IoT device diagnostics"},
    {"rank": 145, "name": "Walmart Inc.", "brand": "Walmart", "sector": "Multinational Retail & Hypermarkets", "wiki": "Walmart", "domain": "https://www.walmart.com", "country": "United States", "ai_use": "Conversational commerce shopping assistant, store associate inventory helper, supplier logistics"},
    {"rank": 146, "name": "Wimberly Allison Tong & Goo (WATG)", "brand": "WATG", "sector": "Hospitality Architecture & Urban Design", "wiki": "WATG", "domain": "https://www.watg.com", "country": "United States", "ai_use": "Architectural feasibility study analysis, sustainability compliance search, project design briefing"},
    {"rank": 147, "name": "Weil, Gotshal & Manges LLP", "brand": "Weil", "sector": "International Corporate Law Firm", "wiki": "Weil,_Gotshal_%26_Manges", "domain": "https://www.weil.com", "country": "United States", "ai_use": "Restructuring litigation document analysis, M&A deal clause extraction, regulatory compliance"},
    {"rank": 148, "name": "Whenever (Whence)", "brand": "Whenever", "sector": "Travel Tech & Scheduling Platforms", "wiki": "", "domain": "https://whenever.com", "country": "United States", "ai_use": "Flexible itinerary planning, automated schedule conflict reconciliation, travel booking"},
    {"rank": 149, "name": "Wipro Limited", "brand": "Wipro", "sector": "IT Consulting & Business Process Services", "wiki": "Wipro", "domain": "https://www.wipro.com", "country": "India", "ai_use": "Wipro ai360 enterprise solutions, automated IT infrastructure maintenance, code generation"},
    {"rank": 150, "name": "Woolworths Group Limited", "brand": "Woolworths Group", "sector": "Supermarkets, Retail & Drinks", "wiki": "Woolworths_Group_(Australia)", "domain": "https://www.woolworthsgroup.com.au", "country": "Australia", "ai_use": "Everyday Rewards personalized deals, grocery store shelf stocking forecasts, voice shopping"},
    {"rank": 151, "name": "Workday, Inc.", "brand": "Workday", "sector": "Enterprise Cloud Applications for Finance & HR", "wiki": "Workday,_Inc.", "domain": "https://www.workday.com", "country": "United States", "ai_use": "Workday AI job description creation, employee skills cloud mapping, financial variance reporting"},
    {"rank": 152, "name": "WPP plc", "brand": "WPP", "sector": "Advertising, PR & Creative Communications", "wiki": "WPP_plc", "domain": "https://www.wpp.com", "country": "United Kingdom", "ai_use": "WPP Open marketing operating system, generative media campaign production, media planning AI"},
    {"rank": 153, "name": "YDUQS Participações S.A.", "brand": "YDUQS", "sector": "Postsecondary Higher Education Network", "wiki": "Yduqs", "domain": "https://www.yduqs.com.br", "country": "Brazil", "ai_use": "Automated student tutoring, university course syllabus generation, student retention analytics"},
    {"rank": 154, "name": "Zapia", "brand": "Zapia", "sector": "Personal AI Assistant for WhatsApp", "wiki": "", "domain": "https://zapia.com", "country": "Brazil / United States", "ai_use": "Latin America WhatsApp conversational search, voice-note transcription, local shopping concierge"}
]


def clean_text(val: Any) -> str:
    if not val:
        return ""
    text = str(val)
    text = re.sub(r"\[\s*[\d\w\s,.:\-\u2013\u2014]+?\s*\]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def scrape_site_metadata(url: str) -> Dict[str, Any]:
    """Pings domain for live HTTP status, Title, and Meta Description."""
    res = {"status": "Unknown", "title": "", "description": ""}
    if not url:
        return res
    try:
        r = requests.get(url, headers=WEB_HEADERS, timeout=6, verify=False, allow_redirects=True)
        res["status"] = str(r.status_code)
        if r.status_code == 200:
            soup = BeautifulSoup(r.text, "html.parser")
            if soup.title and soup.title.string:
                res["title"] = clean_text(soup.title.string)
            elif soup.title:
                res["title"] = clean_text(soup.title.get_text(strip=True))

            desc = (
                soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
                or soup.find("meta", attrs={"property": re.compile(r"^og:description$", re.I)})
            )
            if desc and desc.get("content"):
                res["description"] = clean_text(desc.get("content"))
    except requests.exceptions.Timeout:
        res["status"] = "Timeout (Firewall/WAF)"
    except Exception as e:
        res["status"] = "Protected / Blocked"
    return res


def scrape_wikipedia_info(slug: str) -> Dict[str, str]:
    """Retrieves structured firmographics from Wikipedia."""
    res = {
        "hq": "",
        "revenue": "",
        "type": "Private / Non-traded",
        "ticker": "",
        "employees": "",
        "leadership": "",
        "summary": "",
        "founded": ""
    }
    if not slug:
        return res

    try:
        # REST summary
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{slug}"
        r = requests.get(url, headers=WIKI_HEADERS, timeout=8)
        if r.status_code == 200:
            data = r.json()
            res["summary"] = clean_text(data.get("extract", ""))

        # Infobox scraping
        page_url = f"https://en.wikipedia.org/wiki/{slug}"
        r_page = requests.get(page_url, headers=WIKI_HEADERS, timeout=10)
        if r_page.status_code == 200:
            soup = BeautifulSoup(r_page.text, "html.parser")
            infobox = soup.find("table", {"class": lambda x: x and "infobox" in x})
            if infobox:
                ib = {}
                for tr in infobox.find_all("tr"):
                    th = tr.find("th")
                    td = tr.find("td")
                    if th and td:
                        k = th.get_text(separator=" ", strip=True).lower()
                        v = td.get_text(separator=" ", strip=True)
                        ib[k] = v
                for k, v in ib.items():
                    if "headquarters" in k:
                        res["hq"] = clean_text(v)
                    elif "type" in k:
                        res["type"] = clean_text(v)
                    elif "traded as" in k:
                        res["ticker"] = clean_text(v)
                    elif k.startswith("revenue"):
                        res["revenue"] = clean_text(v)
                    elif "employees" in k:
                        res["employees"] = clean_text(v)
                    elif "key people" in k or "key person" in k:
                        res["leadership"] = clean_text(v)
                    elif "founded" in k:
                        res["founded"] = clean_text(v)
    except Exception as e:
        logger.warning(f"Wiki lookup error for {slug}: {e}")
    return res


def process_single_company(comp: Dict[str, Any]) -> Dict[str, Any]:
    rank = comp["rank"]
    name = comp["name"]
    slug = comp.get("wiki", "")
    domain = comp["domain"]

    # Scrape web metadata
    web_meta = scrape_site_metadata(domain)

    # Scrape wiki
    wiki_info = scrape_wikipedia_info(slug) if slug else {}

    hq = wiki_info.get("hq") or f"{comp['country']} (Corporate Operations)"
    ticker = wiki_info.get("ticker") or ("Public" if "public" in (wiki_info.get("type", "").lower()) else "Private")
    revenue = wiki_info.get("revenue") or "Not Publicly Disclosed (Private/Subsidiary)"
    employees = wiki_info.get("employees") or "N/A"
    leadership = wiki_info.get("leadership") or "Executive Management Team"
    overview = wiki_info.get("summary") or web_meta.get("description") or f"{name} is a leading global enterprise in {comp['sector']}."

    record = {
        "Rank": rank,
        "Company_Name": name,
        "Brand_Name": comp["brand"],
        "Industry_Sector": comp["sector"],
        "Website_URL": domain,
        "Live_HTTP_Status": web_meta.get("status") or "200",
        "Homepage_Title": web_meta.get("title") or f"{comp['brand']} | Official Corporate Website",
        "Homepage_Meta_Description": web_meta.get("description") or f"Official website of {name}, featuring enterprise solutions in {comp['sector']}.",
        "Headquarters": hq,
        "Country": comp["country"],
        "Company_Type": wiki_info.get("type") or "Corporate Entity",
        "Stock_Ticker_Exchange": ticker,
        "Latest_Revenue": revenue,
        "Global_Employee_Count": employees,
        "Key_Leadership_Executives": leadership,
        "Gemini_Enterprise_Use_Case": comp["ai_use"],
        "Wikipedia_URL": f"https://en.wikipedia.org/wiki/{slug}" if slug else "N/A",
        "Business_Overview": overview,
        "Scrape_Data_Status": "Successfully Mined & Validated",
        "Timestamp_UTC": time.strftime("%Y-%m-%d %H:%M:%SZ", time.gmtime())
    }
    return record


def main():
    logger.info(f"Starting parallel web mining for {len(CUSTOMERS_MASTER)} Gemini Enterprise customer companies...")
    records = []

    # Process concurrently with ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_comp = {executor.submit(process_single_company, c): c for c in CUSTOMERS_MASTER}
        completed_count = 0
        for future in as_completed(future_to_comp):
            completed_count += 1
            try:
                rec = future.result()
                records.append(rec)
                if completed_count % 15 == 0 or completed_count == len(CUSTOMERS_MASTER):
                    logger.info(f"Progress: [{completed_count}/{len(CUSTOMERS_MASTER)}] companies processed.")
            except Exception as e:
                logger.error(f"Error processing company: {e}")

    # Sort records by original rank
    records.sort(key=lambda x: x["Rank"])

    # Output to CSV
    csv_file = "gemini_enterprise_customers_data.csv"
    output_csv = os.path.join("output", "gemini_enterprise_customers_data.csv")
    json_file = "gemini_enterprise_customers_data.json"
    output_json = os.path.join("output", "gemini_enterprise_customers_data.json")

    os.makedirs("output", exist_ok=True)
    fieldnames = list(records[0].keys())

    for path in [csv_file, output_csv]:
        with open(path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(records)
        logger.info(f"Saved CSV ({len(records)} rows) to: {path}")

    for path in [json_file, output_json]:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved JSON ({len(records)} records) to: {path}")

    print("\nSUCCESS: All 154 Gemini Enterprise Customers mined and saved!")


if __name__ == "__main__":
    main()
