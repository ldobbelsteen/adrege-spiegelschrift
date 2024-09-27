from fontTools import ttLib
from sys import stdin, stdout
from io import BytesIO
from xml.dom import minidom


def font_to_xml(data: bytes):
    """Convert a font file's bytes to XML and return its name."""
    mock_input = BytesIO(data)
    font = ttLib.TTFont(mock_input)
    name = font["name"].getBestFullName()
    if not isinstance(name, str):
        name = "FlipFontError"
    mock_output = BytesIO()
    font.saveXML(mock_output)
    xml_data = mock_output.getvalue()
    return minidom.parse(BytesIO(xml_data)), name


def xml_to_font(dom: minidom.Document):
    """Convert XML to a font file's bytes."""
    xml_data = dom.toxml(encoding="utf-8")
    mock_input = BytesIO(xml_data)
    mock_output = BytesIO()
    font = ttLib.TTFont()
    font.importXML(mock_input)
    font.save(mock_output)
    return mock_output.getvalue()


def flip_ttx_of_ttf(ttx: minidom.Document, old_font_name: str):
    """Flip glyphs in the TTX representation of a TTF font."""

    # Extract relevant tables from xml
    ttf_elements = ttx.childNodes[0].childNodes
    hmtx_node = [X for X in ttf_elements if X.localName == "hmtx"][0]
    glyf_node = [X for X in ttf_elements if X.localName == "glyf"][0]
    name_node = [X for X in ttf_elements if X.localName == "name"][0]
    kern_list = [X for X in ttf_elements if X.localName == "kern"]

    # Create hmtx dictionary
    hmtx_dict = dict()
    for node in [X for X in hmtx_node.childNodes if X.localName == "mtx"]:
        name = node.getAttribute("name")
        hmtx_dict[name] = node

    # Flip all glyphs
    n_glyfs = 0
    for glyf in [X for X in glyf_node.childNodes if X.localName == "TTGlyph"]:
        name = glyf.getAttribute("name")
        if name.startswith("."):
            continue
        hmtx = hmtx_dict[name]
        hadv = int(hmtx.getAttribute("width"))
        try:
            int(glyf.getAttribute("xMin"))
        except Exception:
            continue
        x_max = int(glyf.getAttribute("xMax"))
        hmtx.setAttribute("lsb", str(hadv - x_max))

        for pt in glyf.getElementsByTagName("pt"):
            old_x = int(pt.getAttribute("x"))
            pt.setAttribute("x", str(hadv - old_x))
        n_glyfs += 1

    # Flip kerning list
    if kern_list:
        n_pairs = 0
        for pair in kern_list[0].getElementsByTagName("pair"):
            old_left, old_right = pair.getAttribute("l"), pair.getAttribute("r")
            pair.setAttribute("l", old_right)
            pair.setAttribute("r", old_left)
            n_pairs += 1

    # Inverse all font names
    new_font_name = old_font_name[::-1]
    for name_record in name_node.getElementsByTagName("namerecord"):
        for child in name_record.childNodes:
            if isinstance(child.nodeValue, str):
                updated = child.nodeValue.replace(old_font_name, new_font_name)
                child.nodeValue = updated

    return ttx


if __name__ == "__main__":
    font = stdin.buffer.read()
    input_xml, font_name = font_to_xml(font)
    output_xml = flip_ttx_of_ttf(input_xml, font_name)
    font = xml_to_font(output_xml)
    stdout.buffer.write(font)
