import os
import re

def build_interactive_gallery(md_filepath, output_html_filepath):
    print(f"Reading markdown from {md_filepath}")
    
    with open(md_filepath, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # 1. Parse Markdown into structured data
    acts_data = [] # List of dicts: {'act_name': '...', 'images': [...]}
    current_act = None
    
    # Split by acts
    act_sections = re.split(r'\n## (\bACT [A-ZIVX]+: [^\n]+)\n', md_content)
    
    if len(act_sections) > 1:
        # First element is preamble, skip it
        for i in range(1, len(act_sections), 2):
            act_title = act_sections[i].strip()
            act_content = act_sections[i+1]
            
            act_data = {'act_name': act_title, 'images': []}
            
            # Extract images within this act
            # Format: **Image 01: Title**\n- **Perspective:** ...\n- **Symbolism:** ...\n- **Depth:** ...\n- **Mood:** ...
            image_blocks = re.split(r'\n\*\*Image \d{2}: ', act_content)
            
            for j in range(1, len(image_blocks)):
                block = image_blocks[j]
                lines = block.strip().split('\n')
                
                # First line is the title (minus the leading '**Image XX: ')
                img_title_line = lines[0].strip()
                if img_title_line.endswith('**'):
                    img_title_line = img_title_line[:-2]
                
                # We need to grab the original image number to find the corresponding file
                # The split removed 'Image XX: ', so we have to guess it based on sequential order 
                # or extract from original markdown. A safer way is regex on the full act_content.
                pass
    
    # Let's do a more robust regex parsing over the whole file
    
    # Find all acts
    act_matches = list(re.finditer(r'^## (ACT .*)$', md_content, re.MULTILINE))
    
    # Find all images
    # Regex looks for `**Image 01: Title**`
    img_matches = list(re.finditer(r'^\*\*Image (\d{2}): (.*?)\*\*$', md_content, re.MULTILINE))
    
    # Image filename mapping (same as the docx script)
    image_map = {
        "01": "image_01_newborn_god_fantasy_1772342846066.png",
        "02": "image_02_singing_wall_fantasy_1772342753149.png",
        "03": "image_03_crown_of_whispers_fantasy_1772342768249.png",
        "04": "image_04_one_way_kingdom_fantasy_1772342781286.png",
        "05": "image_05_stolen_fluid_fantasy_1772342800013.png",
        "06": "image_06_tear_never_lands_fantasy_1772342813076.png",
        "07": "image_07_silent_panic_fantasy_1772342954963.png",
        "08": "image_08_thousand_burning_farewells_fantasy_1772342968585.png",
        "09": "image_09_blue_annunciation_fantasy_1772364584377.png",
        "10": "image_10_first_sensation_fantasy_1772364597233.png",
        "11": "image_11_prismatic_ceiling_fantasy_1772364759365.png",
        "12": "image_12_laughing_wind_fantasy_1772364775764.png",
        "13": "image_13_beacon_fantasy_1772364789310.png",
        "14": "image_14_mud_fingernails_fantasy_1772364817303.png",
        "15": "image_15_the_maw_fantasy_1772364829439.png",
        "16": "image_16_the_two_eyes_fantasy_1772365030402.png",
        "17": "image_17_giants_geometry_fantasy_1772365050612.png",
        "18": "image_18_word_made_floor_fantasy_1772365062851.png",
        "19": "image_19_sentient_corridor_fantasy_1772365076711.png",
        "20": "image_20_neural_vines_fantasy_1772365089719.png",
        "21": "image_21_warm_words_fantasy_1772365101680.png",
        "22": "image_22_five_pillars_fantasy_1772365299234.png",
        "23": "image_23_eyes_that_breathe_fantasy_1772365317134.png",
        "24": "image_24_paradox_prison_fantasy_1772365332567.png",
        "25": "image_25_invisible_assault_fantasy_1772365348967.png",
        "26": "image_26_face_stone_1772386083269.png",
        "27": "image_27_unreachable_sphere_1772386111608.png",
        "28": "image_28_three_dawns_1772386374385.png",
        "29": "image_29_palace_rises_1772386388094.png",
        "30": "image_30_immortals_landing_1772386410040.png"
    }
    
    gallery_data = [] # List of Acts
    
    current_act_index = -1
    for i, act_match in enumerate(act_matches):
        act_title = act_match.group(1).strip()
        act_start = act_match.end()
        act_end = act_matches[i+1].start() if i+1 < len(act_matches) else len(md_content)
        
        act_obj = {
            'title': act_title,
            'images': []
        }
        
        # Find images within this act's bounds
        for img_match in img_matches:
            if act_start < img_match.start() < act_end:
                img_num = img_match.group(1)
                img_title = img_match.group(2).strip()
                
                # Extract the 4 bullet points following this heading
                # We look from the end of the image heading to the start of the next one (or end of act)
                block_start = img_match.end()
                
                perspective = ""
                symbolism = ""
                depth = ""
                mood = ""
                
                # Simple extraction using regex for the bullets within a reasonable window
                search_window = md_content[block_start:block_start+1000]
                
                p_match = re.search(r'- \*\*Perspective:\*\* (.*?)$', search_window, re.MULTILINE)
                if p_match: perspective = p_match.group(1).strip()
                
                s_match = re.search(r'- \*\*Symbolism:\*\* (.*?)$', search_window, re.MULTILINE)
                if s_match: symbolism = s_match.group(1).strip()
                
                d_match = re.search(r'- \*\*Depth:\*\* (.*?)$', search_window, re.MULTILINE)
                if d_match: depth = d_match.group(1).strip()
                
                m_match = re.search(r'- \*\*Mood:\*\* (.*?)$', search_window, re.MULTILINE)
                if m_match: mood = m_match.group(1).strip()
                
                filename = image_map.get(img_num, "")
                
                # Ensure the path works for HTML
                rel_path = f"Final Conceptual Images/{filename}"
                
                act_obj['images'].append({
                    'id': f"img_{img_num}",
                    'num': img_num,
                    'title': img_title,
                    'src': rel_path,
                    'perspective': perspective,
                    'symbolism': symbolism,
                    'depth': depth,
                    'mood': mood
                })
        
        gallery_data.append(act_obj)

    # 2. Build HTML
    
    # Generate JS data structure
    import json
    js_data = json.dumps(gallery_data, indent=2)
    
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Endings Wake Concept Art Gallery</title>
    <style>
        :root {{
            --bg-dark: #070B14;
            --bg-panel: #111A2C;
            --bg-active: #1D2A43;
            --accent-blue: #4A90E2;
            --accent-gold: #E2B961;
            --text-main: #E2E8F0;
            --text-muted: #94A3B8;
            --border-color: rgba(255, 255, 255, 0.08);
            --glow: 0 0 20px rgba(74, 144, 226, 0.15);
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-main);
            display: flex;
            height: 100vh;
            overflow: hidden;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }}

        /* Typography */
        h1, h2, h3, h4 {{ font-weight: 600; letter-spacing: -0.02em; }}
        
        /* Layout */
        #sidebar {{
            width: 380px;
            background-color: var(--bg-panel);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            height: 100%;
            z-index: 10;
            box-shadow: 4px 0 24px rgba(0,0,0,0.4);
        }}

        #sidebar-header {{
            padding: 32px 24px 24px;
            border-bottom: 1px solid var(--border-color);
            background: linear-gradient(180deg, rgba(29, 42, 67, 0.4) 0%, rgba(17, 26, 44, 0) 100%);
        }}

        #sidebar-header h1 {{
            font-size: 20px;
            color: #fff;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }}
        
        #sidebar-header p {{
            font-size: 13px;
            color: var(--accent-gold);
            font-style: italic;
        }}

        #nav-container {{
            flex: 1;
            overflow-y: auto;
            padding: 16px 0;
        }}
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {{ width: 6px; }}
        ::-webkit-scrollbar-track {{ background: transparent; }}
        ::-webkit-scrollbar-thumb {{ background: rgba(255, 255, 255, 0.1); border-radius: 10px; }}
        ::-webkit-scrollbar-thumb:hover {{ background: rgba(255, 255, 255, 0.2); }}

        /* Navigation Items */
        .act-group {{
            margin-bottom: 24px;
        }}

        .act-title {{
            padding: 8px 24px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--text-muted);
            font-weight: 700;
            margin-bottom: 4px;
        }}

        .nav-item {{
            padding: 12px 24px 12px 36px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            font-size: 14px;
            color: var(--text-main);
            display: flex;
            align-items: center;
        }}
        
        .nav-item::before {{
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background-color: var(--accent-blue);
            transform: scaleY(0);
            transition: transform 0.3s ease;
            transform-origin: center;
        }}

        .nav-item:hover {{
            background-color: rgba(255, 255, 255, 0.03);
            color: #fff;
            padding-left: 40px;
        }}

        .nav-item.active {{
            background-color: var(--bg-active);
            color: #fff;
            font-weight: 500;
        }}
        
        .nav-item.active::before {{
            transform: scaleY(1);
        }}
        
        .nav-num {{
            color: var(--text-muted);
            margin-right: 12px;
            font-size: 12px;
            font-variant-numeric: tabular-nums;
        }}
        
        .nav-item.active .nav-num {{
            color: var(--accent-gold);
        }}

        /* Main Content */
        #main-content {{
            flex: 1;
            height: 100%;
            overflow-y: auto;
            position: relative;
            background: radial-gradient(circle at center, #111a2d 0%, #070b14 100%);
        }}

        .gallery-view {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 64px 48px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }}
        
        .gallery-view.visible {{
            opacity: 1;
            transform: translateY(0);
        }}

        /* Image Display */
        .image-container {{
            width: 100%;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
            margin-bottom: 40px;
            position: relative;
        }}
        
        .image-placeholder {{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }}

        .main-image {{
            width: 100%;
            height: auto;
            max-height: 70vh;
            object-fit: contain;
            display: block;
        }}

        /* Brief Text Display */
        .brief-container {{
            background: rgba(17, 26, 44, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 40px;
            box-shadow: var(--glow);
        }}

        .brief-header {{
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border-color);
        }}
        
        .brief-meta {{
            color: var(--accent-gold);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin-bottom: 8px;
        }}

        .brief-title {{
            font-size: 28px;
            color: #fff;
            letter-spacing: -0.01em;
        }}

        .brief-grid {{
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
        }}
        
        @media (min-width: 1100px) {{
            .brief-grid {{
                grid-template-columns: 1fr 1fr;
            }}
            .symbolism-full {{
                grid-column: 1 / -1;
            }}
        }}

        .attribute {{
            position: relative;
        }}

        .attr-label {{
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--text-muted);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }}
        
        .attr-label::after {{
            content: '';
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, var(--border-color) 0%, transparent 100%);
            margin-left: 12px;
        }}

        .attr-text {{
            font-size: 15px;
            color: var(--text-main);
            line-height: 1.7;
        }}

    </style>
    <!-- Preload a nice font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

    <nav id="sidebar">
        <div id="sidebar-header">
            <h1>Endings Wake</h1>
            <p>Conceptual Visual Brief</p>
        </div>
        <div id="nav-container">
            <!-- Populated by JS -->
        </div>
    </nav>

    <main id="main-content">
        <div class="gallery-view" id="gallery-target">
            <!-- Populated by JS -->
        </div>
    </main>

    <script>
        // Data injected from Python script
        const galleryData = {js_data};
        
        const navContainer = document.getElementById('nav-container');
        const galleryTarget = document.getElementById('gallery-target');
        
        let allImages = [];
        let currentlyActiveId = null;

        // Initialize Application
        function init() {{
            buildNavigation();
            
            // Collect flat list of all images for easy lookup
            galleryData.forEach(act => {{
                act.images.forEach(img => {{
                    allImages.push(img);
                }});
            }});

            // Load first image by default if exists
            if (allImages.length > 0) {{
                loadImage(allImages[0].id);
            }}
        }}

        function buildNavigation() {{
            galleryData.forEach((act, actIndex) => {{
                // Create Act Group
                const groupDiv = document.createElement('div');
                groupDiv.className = 'act-group';
                
                // Act Title
                const titleDiv = document.createElement('div');
                titleDiv.className = 'act-title';
                titleDiv.textContent = act.title;
                groupDiv.appendChild(titleDiv);
                
                // Images in Act
                act.images.forEach(img => {{
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'nav-item';
                    itemDiv.id = `nav-${{img.id}}`;
                    
                    itemDiv.innerHTML = `
                        <span class="nav-num">${{img.num}}</span>
                        <span class="nav-name">${{img.title}}</span>
                    `;
                    
                    itemDiv.addEventListener('click', () => loadImage(img.id));
                    groupDiv.appendChild(itemDiv);
                }});
                
                navContainer.appendChild(groupDiv);
            }});
        }}

        function loadImage(imageId) {{
            const imgData = allImages.find(i => i.id === imageId);
            if (!imgData) return;
            
            // Update Navigation State
            if (currentlyActiveId) {{
                const prevActive = document.getElementById(`nav-${{currentlyActiveId}}`);
                if (prevActive) prevActive.classList.remove('active');
            }}
            
            const newActive = document.getElementById(`nav-${{imageId}}`);
            if (newActive) newActive.classList.add('active');
            currentlyActiveId = imageId;
            
            // Find parent Act for metadata
            const parentAct = galleryData.find(act => act.images.some(i => i.id === imageId));
            
            // Animate out
            galleryTarget.classList.remove('visible');
            
            // Wait for fade out, then render new content and fade in
            setTimeout(() => {{
                renderDisplay(imgData, parentAct ? parentAct.title : "Conceptual Brief");
                
                // Trigger reflow to ensure CSS animation restarts
                void galleryTarget.offsetWidth;
                
                galleryTarget.classList.add('visible');
            }}, 300); // Wait half of the transition duration for smoother crossfade
        }}

        function renderDisplay(data, actTitle) {{
            galleryTarget.innerHTML = `
                <div class="image-container">
                    <div class="image-placeholder">
                        <img src="${{data.src}}" alt="${{data.title}}" class="main-image" loading="lazy">
                    </div>
                </div>
                
                <div class="brief-container">
                    <div class="brief-header">
                        <div class="brief-meta">${{actTitle}} • IMAGE ${{data.num}}</div>
                        <h2 class="brief-title">${{data.title}}</h2>
                    </div>
                    
                    <div class="brief-grid">
                        <div class="attribute symbolism-full">
                            <div class="attr-label">Symbolism & Narrative Purpose</div>
                            <div class="attr-text">${{data.symbolism}}</div>
                        </div>
                        
                        <div class="attribute">
                            <div class="attr-label">Perspective</div>
                            <div class="attr-text">${{data.perspective}}</div>
                        </div>
                        
                        <div class="attribute">
                            <div class="attr-label">Mood & Atmosphere</div>
                            <div class="attr-text">${{data.mood}}</div>
                        </div>
                        
                        <div class="attribute">
                            <div class="attr-label">Depth & Focus</div>
                            <div class="attr-text">${{data.depth}}</div>
                        </div>
                    </div>
                </div>
            `;
        }}

        // Start
        document.addEventListener('DOMContentLoaded', init);

    </script>
</body>
</html>
"""

    with open(output_html_filepath, 'w', encoding='utf-8') as f:
        f.write(html_content)
        
    print(f"Gallery HTML written successfully to {output_html_filepath}")

if __name__ == "__main__":
    input_md = r"c:\Users\wcb0a\OneDrive\Documents\Personal\AI Business\Sites\Grayson\Book Cover\endings_wake_conceptual_brief.md"
    output_html = r"c:\Users\wcb0a\OneDrive\Documents\Personal\AI Business\Sites\Grayson\Book Cover\Endings_Wake_Gallery.html"
    
    build_interactive_gallery(input_md, output_html)
