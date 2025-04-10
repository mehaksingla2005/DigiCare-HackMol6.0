from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.colors import HexColor
import os
from datetime import datetime

def format_key_as_title(key):
    """Convert snake_case to Title Case with proper spacing."""
    return key.replace("_", " ").title()

def style_number_data(value):
    """Format numeric values with highlighting."""
    try:
        # Check if value is numeric or can be converted to a number
        if isinstance(value, (int, float)) or (
            isinstance(value, str) and value.strip() and 
            value.replace('.', '', 1).replace('-', '', 1).isdigit()
        ):
            return f'<b><font color="#0B6FA4">{value}</font></b>'
    except (ValueError, TypeError):
        pass
    
    # Return as string for non-numeric values
    return str(value) if value is not None else ""

def process_nested_data(data, styles, level=0):
    """Process nested data structures recursively."""
    elements = []
    indent = "&nbsp;" * (level * 4)  # Add indentation for nested items
    
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                # Add section header
                elements.append(Paragraph(
                    f"{indent}<b>{format_key_as_title(key)}:</b>", 
                    styles['SectionStyle']
                ))
                # Process nested data with increased indentation
                elements.extend(process_nested_data(value, styles, level + 1))
            else:
                # Add key-value pair
                elements.append(Paragraph(
                    f"{indent}<b>{format_key_as_title(key)}:</b> {style_number_data(value)}", 
                    styles['SectionStyle']
                ))
    elif isinstance(data, list):
        for i, item in enumerate(data):
            if isinstance(item, (dict, list)):
                if level > 0:  # Only add item numbers for nested lists
                    elements.append(Paragraph(
                        f"{indent}<b>Item {i+1}:</b>", 
                        styles['SectionStyle']
                    ))
                elements.extend(process_nested_data(item, styles, level + 1))
            else:
                # Add simple list item
                elements.append(Paragraph(
                    f"{indent}• {style_number_data(item)}", 
                    styles['SectionStyle']
                ))
    
    return elements

def generate_structured_pdf(json_data, output_path=None, title="Medical Insight Report"):
    """Generate a structured PDF from JSON data with improved formatting."""
    # Set default filename if not provided
    if output_path is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = f"medical_report_{timestamp}.pdf"
    
    # Create document
    doc = SimpleDocTemplate(output_path, pagesize=A4, rightMargin=50, leftMargin=50, 
                           topMargin=50, bottomMargin=50)
    
    # Define styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='TitleStyle',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=HexColor("#0B6FA4"),
        alignment=TA_CENTER,
        spaceAfter=12
    ))
    
    styles.add(ParagraphStyle(
        name='SectionStyle',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=6,
        leading=14  # Control line spacing
    ))
    
    styles.add(ParagraphStyle(
        name='MainHeading',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=HexColor("#333333"),
        spaceAfter=8,
        spaceBefore=12
    ))
    
    # Create document elements
    elements = []
    
    # Add title
    elements.append(Paragraph(title, styles['TitleStyle']))
    elements.append(Spacer(1, 12))
    
    # Add timestamp
    date_str = datetime.now().strftime("%B %d, %Y - %H:%M")
    elements.append(Paragraph(f"Generated: {date_str}", styles['SectionStyle']))
    elements.append(Spacer(1, 12))
    
    # Process top-level items
    for key, value in json_data.items():
        # Add main section header
        elements.append(Paragraph(format_key_as_title(key), styles['MainHeading']))
        
        # Process section content
        elements.extend(process_nested_data(value, styles))
        elements.append(Spacer(1, 8))
    
    # Build document
    try:
        doc.build(elements)
        return os.path.abspath(output_path)
    except Exception as e:
        print(f"Error generating PDF: {str(e)}")
        return None