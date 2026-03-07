import re
import os

html_path = 'services.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Make the feature cards clickable!
# Find the overall Everything Your Business Needs section
# Instead of a regex, let's just replace all <div class="feature-card reveal" 
def repl(m):
    id_val = m.group(1) if m.group(1) else ''
    content = m.group(2)
    id_str = f'id="{id_val}" ' if id_val else ''
    
    # generate a filename based on title
    title_search = re.search(r'<h3 class="feature-card__title">([^<]+)</h3>', content)
    title = title_search.group(1) if title_search else 'service'
    filename = title.lower().replace(' ', '-').replace('&amp;', 'and').replace(',', '')
    
    # generate the a tag
    href = f'service-{filename}.html'
    
    new_html = f'<a href="{href}" class="feature-card reveal" {id_str}>\n{content}\n                    <div class="feature-card__more">Learn More <i class="fa-solid fa-arrow-right"></i></div>\n                </a>'
    return new_html

html_updated = re.sub(r'<div class="feature-card reveal"(?: id="([^"]+)")?>(.*?)</div>', repl, html, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_updated)

# Now we need to generate 14 pages based on index.html or services.html header/footer
# Let's extract header and footer from services.html
header_match = re.search(r'(.*?<!-- Page Hero -->)', html, flags=re.DOTALL)
footer_match = re.search(r'(<!-- Final CTA -->.*)', html, flags=re.DOTALL)

if header_match and footer_match:
    header = header_match.group(1)
    footer = footer_match.group(1)
    
    # Now let's find all the services to generate pages for
    services = re.findall(r'<h3 class="feature-card__title">([^<]+)</h3>\s*<p class="feature-card__text">([^<]+)</p>', html)
    
    for title, desc in services:
        filename = title.lower().replace(' ', '-').replace('&amp;', 'and').replace(',', '')
        page_html = header + f"""
    <section class="page-hero">
        <div class="page-hero__bg" style="background-image:linear-gradient(rgba(17,17,17,0.75),rgba(17,17,17,0.75)),url('./images/hero-2.png')"></div>
        <div class="page-hero__content">
            <h1 class="page-hero__title">{title}</h1>
            <p class="page-hero__sub">{desc}</p>
            <div class="page-hero__breadcrumb"><a href="index.html">Home</a> / <a href="services.html">Services</a> / <span>{title}</span></div>
        </div>
    </section>
    
    <section class="svc-section" style="padding: 100px 0;">
        <div class="container">
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <span class="section-tag" style="margin-bottom: 20px;">Premium Service</span>
                <h2 style="font-size: 36px; font-weight: 900; margin-bottom: 24px;">Professional {title}</h2>
                <p style="font-size: 18px; color: var(--muted); line-height: 1.8; margin-bottom: 40px;">
                    {desc} We provide comprehensive solutions to ensure your business thrives in the digital landscape. Our dedicated team uses the latest techniques and strategies tailored specifically for your brand.
                </p>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <a href="contact.html" class="btn btn--primary btn--lg">Get Started Today</a>
                    <a href="pricing.html" class="btn btn--outline btn--lg">View Pricing</a>
                </div>
            </div>
            
            <div style="margin-top: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: left;">
                <div style="background: var(--light-gray); padding: 40px; border-radius: var(--radius-lg);">
                    <h3 style="font-size: 24px; font-weight: 800; margin-bottom: 20px;">Why Choose Us?</h3>
                    <ul class="svc-detail__features">
                        <li><i class="fa-solid fa-check-circle"></i> Industry-leading expertise and proven results</li>
                        <li><i class="fa-solid fa-check-circle"></i> Customized strategies for your specific goals</li>
                        <li><i class="fa-solid fa-check-circle"></i> Transparent reporting and dedicated support</li>
                        <li><i class="fa-solid fa-check-circle"></i> Continuous optimization for maximum ROI</li>
                    </ul>
                </div>
                <div style="background: var(--black); color: white; padding: 40px; border-radius: var(--radius-lg);">
                    <h3 style="font-size: 24px; font-weight: 800; margin-bottom: 20px; color: white;">Ready to scale?</h3>
                    <p style="color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 30px;">
                        Let our experts handle your {title} needs so you can focus on running your business. Drop us a message or request a free quote to get started immediately.
                    </p>
                    <a href="contact.html" class="btn btn--white">Request a Quote <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    </section>
""" + footer
        
        # Write the file
        filepath = f"service-{filename}.html"
        # Only create if it doesn't already exist or just overwrite
        with open(filepath, 'w', encoding='utf-8') as pf:
            pf.write(page_html)
            
    print("Successfully updated services.html and generated 14 individual service pages.")
else:
    print("Failed to find header or footer.")
