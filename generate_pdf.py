import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

pdf_path = r"c:\Users\krish\OneDrive\Desktop\ai\ai\SME_SAGE_Hackathon_Presentation_Guide.pdf"

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Custom styles
primary_color = colors.HexColor("#4F46E5")   # Indigo
secondary_color = colors.HexColor("#06B6D4") # Cyan
dark_bg = colors.HexColor("#0F172A")        # Slate 900
light_bg = colors.HexColor("#F8FAFC")       # Slate 50
accent_warn = colors.HexColor("#F59E0B")     # Amber
accent_danger = colors.HexColor("#EF4444")   # Red
accent_success = colors.HexColor("#10B981")  # Emerald
text_dark = colors.HexColor("#1E293B")      # Slate 800

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=24,
    leading=28,
    textColor=primary_color,
    alignment=TA_CENTER
)

subtitle_style = ParagraphStyle(
    'DocSubTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=12,
    leading=16,
    textColor=secondary_color,
    alignment=TA_CENTER
)

h1_style = ParagraphStyle(
    'SectionH1',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=15,
    leading=18,
    textColor=primary_color,
    spaceBefore=14,
    spaceAfter=6
)

h2_style = ParagraphStyle(
    'SectionH2',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=secondary_color,
    spaceBefore=8,
    spaceAfter=4
)

body_style = ParagraphStyle(
    'BodyDark',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13,
    textColor=text_dark,
    spaceAfter=5
)

bullet_style = ParagraphStyle(
    'BulletText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=12.5,
    textColor=text_dark,
    leftIndent=12,
    spaceAfter=3
)

code_style = ParagraphStyle(
    'CodeText',
    parent=styles['Normal'],
    fontName='Courier',
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor("#0F172A"),
    backColor=colors.HexColor("#F1F5F9"),
    borderColor=colors.HexColor("#CBD5E1"),
    borderWidth=0.5,
    borderPadding=4,
    spaceBefore=4,
    spaceAfter=6
)

story = []

# Header Banner
story.append(Paragraph("SME SAGE — Hackathon Presentation Guide", title_style))
story.append(Spacer(1, 4))
story.append(Paragraph("AI-Powered SME Decision Intelligence Platform | Full Technical & Pitch Dossier", subtitle_style))
story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceAfter=12))

# 1. Executive Summary & Problem
story.append(Paragraph("1. Executive Pitch & Problem Statement", h1_style))
story.append(Paragraph(
    "<b>The Problem:</b> Small & Medium Enterprises (SMEs) struggle with data scattered across Excel, CSVs, POS systems, and billing software. "
    "Traditional Business Intelligence tools (Dashboards) only answer <i>'What happened?'</i> without giving clear operational recommendations.",
    body_style
))
story.append(Paragraph(
    "<b>The Solution: SME SAGE</b> acts as an AI Copilot that guides the SME owner through a complete decision lifecycle:<br/>"
    "<b>RAW DATA &rarr; UNDERSTAND &rarr; DETECT &rarr; EXPLAIN &rarr; RECOMMEND &rarr; SIMULATE &rarr; DECIDE &rarr; TRACK</b>",
    body_style
))
story.append(Spacer(1, 8))

# 2. Tech Stack Overview Table
story.append(Paragraph("2. Complete Technology Stack", h1_style))

stack_data = [
    [Paragraph("<b>Layer</b>", body_style), Paragraph("<b>Technology / Tool</b>", body_style), Paragraph("<b>Purpose / Role in Project</b>", body_style)],
    [Paragraph("<b>Frontend Framework</b>", body_style), Paragraph("React 18 + Vite 6 + TypeScript 5.7", body_style), Paragraph("Single Page Application (SPA) runtime, fast HMR bundling & strict type safety", body_style)],
    [Paragraph("<b>Styling & Icons</b>", body_style), Paragraph("Tailwind CSS 3.4 + Lucide React", body_style), Paragraph("Utility-first dark UI design, glassmorphic layout, responsive grid & iconography", body_style)],
    [Paragraph("<b>Data Visualization</b>", body_style), Paragraph("Recharts 2.15 + Custom SVG Gauge", body_style), Paragraph("Interactive line charts, bar charts, donut breakdowns & 0-100 radial health score gauge", body_style)],
    [Paragraph("<b>Backend Runtime</b>", body_style), Paragraph("Node.js v20.18 + Express 4.21 + tsx", body_style), Paragraph("REST API server on port 5000 with CORS, JSON middleware & hot-reload tsx execution", body_style)],
    [Paragraph("<b>Database Layer</b>", body_style), Paragraph("SQLite WASM (sql.js) + Persistent DB", body_style), Paragraph("In-memory + file-backed SQLite database (sme_sage.db) with zero native compilation", body_style)],
    [Paragraph("<b>File Processing</b>", body_style), Paragraph("xlsx (SheetJS) + Multer", body_style), Paragraph("Parsing uploaded Excel (.xlsx/.xls) / CSV spreadsheets & disk storage", body_style)],
    [Paragraph("<b>Intelligence Engines</b>", body_style), Paragraph("Custom Math & Rule Engines", body_style), Paragraph("Health Score (0-100), Price Elasticity Simulator, Grounded AI Q&A & Data Cleaner", body_style)],
]

t_stack = Table(stack_data, colWidths=[110, 160, 270])
t_stack.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EEF2FF")),
    ('TEXTCOLOR', (0,0), (-1,0), primary_color),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
]))
story.append(t_stack)
story.append(Spacer(1, 10))

# 3. Detailed Frontend Architecture
story.append(Paragraph("3. Frontend Architecture & Page Structure", h1_style))
story.append(Paragraph("<b>State Management & Services:</b>", h2_style))
story.append(Paragraph("<b>&bull; BusinessContext:</b> Global React Context storing current active SME profile, demo dataset state, business health score, and refresh triggers.", bullet_style))
story.append(Paragraph("<b>&bull; ToastContext:</b> Provides floating notifications for user feedback and simulation updates.", bullet_style))
story.append(Paragraph("<b>&bull; Unified API Client (api.ts):</b> Axios-style fetch service connecting frontend components to backend REST endpoints.", bullet_style))

story.append(Spacer(1, 4))
story.append(Paragraph("<b>Core User Interfaces & Modules:</b>", h2_style))

page_data = [
    [Paragraph("<b>Page Module</b>", body_style), Paragraph("<b>Key Functions & Presentation Highlights</b>", body_style)],
    [Paragraph("<b>DashboardPage</b>", body_style), Paragraph("Executive KPIs (Revenue, Profit, Margin, Stock Value), 0-100 Health Score radial gauge, monthly growth charts.", body_style)],
    [Paragraph("<b>AnalyticsPage</b>", body_style), Paragraph("Detailed revenue breakdown, category sales rank, profit margins by SKU, overhead expense spike detection.", body_style)],
    [Paragraph("<b>InventoryPage</b>", body_style), Paragraph("Stock Coverage in months (Stock / Demand), overstock warnings (Mechanical Keyboard), stockout alerts (Power Bank), replenishment PO modal.", body_style)],
    [Paragraph("<b>SimulatorPage</b>", body_style), Paragraph("What-If decision simulation with price/discount sliders, demand elasticity modeling, projected revenue/profit, and mandatory disclaimers.", body_style)],
    [Paragraph("<b>AssistantPage</b>", body_style), Paragraph("'Ask Your Business' natural language query engine grounded in database metrics (Logistics spike, Keyboard capital lockup).", body_style)],
    [Paragraph("<b>DecisionsPage</b>", body_style), Paragraph("Audit log tracking committed business decisions, scenario notes, and implementation timeline.", body_style)],
    [Paragraph("<b>DataUploadPage</b>", body_style), Paragraph("Drag-and-drop CSV/Excel file parser, automated data sanitization preview, null filling, and Data Quality Score (0-100%).", body_style)],
    [Paragraph("<b>ReportsPage</b>", body_style), Paragraph("Printable executive stakeholder dossier with health scores, financial breakdown, and strategic recommendations.", body_style)],
]

t_pages = Table(page_data, colWidths=[120, 420])
t_pages.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F0FDF4")),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
story.append(t_pages)
story.append(Spacer(1, 10))

story.append(PageBreak()) # Clean page split

# 4. Detailed Backend Engines & Formulas
story.append(Paragraph("4. Backend Core Engines & Mathematical Models", h1_style))

story.append(Paragraph("<b>A. Business Health Score Algorithm (0 - 100)</b>", h2_style))
story.append(Paragraph(
    "Calculates a holistic 100-point index using 5 weighted business pillars:<br/>"
    "<b>Health Score = 0.25 &times; RevGrowth + 0.25 &times; Profitability + 0.20 &times; InventoryHealth + 0.15 &times; CustomerRetention + 0.15 &times; ExpenseControl</b>",
    body_style
))
story.append(Paragraph("<i>UrbanKart Retail Score:</i> <b>78 / 100</b> (Stable business health, inventory efficiency requires optimization).", bullet_style))

story.append(Spacer(1, 4))
story.append(Paragraph("<b>B. Stock Coverage Formula</b>", h2_style))
story.append(Paragraph(
    "<b>Stock Coverage (Months) = Current Stock &frasl; Average Monthly Demand</b><br/>"
    "&bull; <b>Overstock Threshold (&gt; 4.0 months):</b> Mechanical Keyboard = 5.1 months (₹6.30 Lakhs capital locked up).<br/>"
    "&bull; <b>Low Stock Threshold (&lt; 1.0 month):</b> Power Bank = 0.3 months (Stock = 18 units, 9 days runway remaining).",
    body_style
))

story.append(Spacer(1, 4))
story.append(Paragraph("<b>C. Price Elasticity & What-If Simulator Engine</b>", h2_style))
story.append(Paragraph(
    "Models demand shift based on price changes:<br/>"
    "&bull; <b>Demand Change (&Delta;Q%):</b> -Elasticity &times; (&Delta;Price &frasl; Original Price)<br/>"
    "&bull; <b>Projected Revenue:</b> New Demand &times; New Price<br/>"
    "&bull; <b>Projected Profit:</b> Revenue - (Demand &times; Unit Cost) - Fixed Overhead",
    body_style
))

story.append(Spacer(1, 4))
story.append(Paragraph("<b>D. Grounded Q&A Assistant Engine</b>", h2_style))
story.append(Paragraph(
    "Answers natural language questions by fetching pre-calculated SQL metrics to eliminate AI hallucination:<br/>"
    "&bull; <i>'Why did my profit decrease?'</i> &rarr; Flags +21.1% logistics fee surge & -22% keyboard slump.<br/>"
    "&bull; <i>'Which product should I restock?'</i> &rarr; Recommends 80-unit Power Bank reorder PO.",
    body_style
))
story.append(Spacer(1, 10))

# 5. UrbanKart Retail Demo Story
story.append(Paragraph("5. Demo Dataset: UrbanKart Retail (Consumer Electronics)", h1_style))

demo_data = [
    [Paragraph("<b>Product SKU</b>", body_style), Paragraph("<b>Status / Category</b>", body_style), Paragraph("<b>Key Business Finding</b>", body_style)],
    [Paragraph("<b>Wireless Earbuds</b>", body_style), Paragraph("<font color='#10B981'><b>Growth Leader</b></font>", body_style), Paragraph("Sales surged +31%, top revenue generator at ₹2.06 Lakhs.", body_style)],
    [Paragraph("<b>Mechanical Keyboard</b>", body_style), Paragraph("<font color='#EF4444'><b>Capital Lockup</b></font>", body_style), Paragraph("Sales slumping (-22%), 420 units on hand (5.1 months coverage), ₹6.30 Lakhs frozen.", body_style)],
    [Paragraph("<b>Power Bank</b>", body_style), Paragraph("<font color='#F59E0B'><b>Stockout Alert</b></font>", body_style), Paragraph("18 units remaining (below reorder limit 30), stockout risk in 9 days.", body_style)],
    [Paragraph("<b>Smart Watch</b>", body_style), Paragraph("Steady Earner", body_style), Paragraph("Consistent performance with a strong 40% profit margin.", body_style)],
    [Paragraph("<b>Logistics Courier Fees</b>", body_style), Paragraph("<font color='#EF4444'><b>Expense Spike</b></font>", body_style), Paragraph("Logistics expense surged +21.1% in recent month due to express surcharges.", body_style)],
]

t_demo = Table(demo_data, colWidths=[120, 110, 310])
t_demo.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#FEF3C7")),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
story.append(t_demo)
story.append(Spacer(1, 10))

# 6. Step-by-Step Hackathon Pitch Script
story.append(Paragraph("6. 10-Step Hackathon Demo Pitch Script", h1_style))

pitch_steps = [
    ("Step 1", "Open http://localhost:3000. Point out the sleek dark dashboard and Continuous Decision Pipeline concept."),
    ("Step 2", "Click 'LOAD DEMO SME' to instantly load UrbanKart Retail data."),
    ("Step 3", "Highlight the 78/100 Business Health Score and overall monthly profit breakdown."),
    ("Step 4", "Navigate to AI Insights. Show the 5 auto-generated diagnostic cards (Logistics surge +21%, Keyboard overstock)."),
    ("Step 5", "Click 'SIMULATE THIS ACTION' on Mechanical Keyboard or Earbuds."),
    ("Step 6", "In Decision Simulator, adjust the discount slider to show live projected revenue, profit impact, and disclaimer."),
    ("Step 7", "Click 'APPLY SCENARIO' to save the simulation into the formal Decision Audit Log."),
    ("Step 8", "Navigate to Ask Your Business. Ask 'Why did my profit decrease this month?' to show grounded AI analysis."),
    ("Step 9", "Navigate to Inventory. Explain the Stock Coverage formula and generate a Power Bank Reorder PO."),
    ("Step 10", "Navigate to Reports. Show the printable executive dossier for bank/investor presentation.")
]

for step_num, step_desc in pitch_steps:
    story.append(Paragraph(f"<b>&bull; {step_num}:</b> {step_desc}", bullet_style))

doc.build(story)
print(f"PDF generated successfully at: {pdf_path}")
