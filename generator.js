const fs = require('fs');

const htmlPath = 'services.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const regex = /<div class="feature-card reveal"(?: id="([^"]+)")?>(\s*<div class="feature-card__icon">[^<]*<i class="[^"]+"><\/i><\/div>\s*<h3 class="feature-card__title">([^<]+)<\/h3>\s*<p class="feature-card__text">([^<]+)<\/p>\s*)<\/div>/g;

const services = [];

const htmlUpdated = html.replace(regex, (match, idVal, content, title, desc) => {
    const idStr = idVal ? `id="${idVal}" ` : '';

    // Some titles might have newlines or extra spaces
    title = title.trim();
    desc = desc.trim();

    const filename = title.toLowerCase().replace(/\s+/g, '-').replace(/&amp;/g, 'and').replace(/,/g, '');
    const href = `service-${filename}.html`;

    services.push({ title, desc, filename });

    return `<a href="${href}" class="feature-card reveal" ${idStr}style="text-decoration:none; color:inherit;">${content}    <div class="feature-card__more">Learn More <i class="fa-solid fa-arrow-right"></i></div>
                </a>`;
});

fs.writeFileSync(htmlPath, htmlUpdated);
console.log(`Updated services.html, found ${services.length} services to extract.`);

// Extract Header and Footer
let header = '';
let footer = '';

try {
    const headerMatch = html.match(/(.*?<!-- Page Hero -->)/s);
    const footerMatch = html.match(/(<!-- Final CTA -->.*)/s);
    if (headerMatch && footerMatch) {
        header = headerMatch[1];
        footer = footerMatch[1];
    }
} catch (e) { }

if (header && footer) {
    for (const svc of services) {
        const pageHtml = header + `
    <section class="page-hero">
        <div class="page-hero__bg" style="background-image:linear-gradient(rgba(17,17,17,0.75),rgba(17,17,17,0.75)),url('./images/hero-2.png')"></div>
        <div class="page-hero__content">
            <h1 class="page-hero__title">${svc.title}</h1>
            <p class="page-hero__sub">${svc.desc}</p>
            <div class="page-hero__breadcrumb"><a href="index.html">Home</a> <span style="margin:0 6px;">/</span> <a href="services.html">Services</a> <span style="margin:0 6px;">/</span> <span style="color:var(--primary);">${svc.title}</span></div>
        </div>
    </section>
    
    <section class="svc-section" style="padding: 100px 0;">
        <div class="container">
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <span class="section-tag" style="margin-bottom: 20px;">Premium Service</span>
                <h2 style="font-size: 36px; font-weight: 900; margin-bottom: 24px;">Professional ${svc.title}</h2>
                <p style="font-size: 18px; color: var(--muted); line-height: 1.8; margin-bottom: 40px;">
                    ${svc.desc} We provide comprehensive solutions to ensure your business thrives in the digital landscape. Our dedicated team uses the latest techniques and strategies tailored specifically for your brand.
                </p>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <a href="contact.html" class="btn btn--primary btn--lg">Get Started Today</a>
                    <a href="pricing.html" class="btn btn--outline btn--lg">View Pricing</a>
                </div>
            </div>
            
            <div style="margin-top: 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; text-align: left;" class="svc-content-grid">
                <style>
                    @media (max-width: 768px) {
                        .svc-content-grid { grid-template-columns: 1fr !important; }
                    }
                </style>
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
                        Let our experts handle your ${svc.title} needs so you can focus on running your business. Drop us a message or request a free quote to get started immediately.
                    </p>
                    <a href="contact.html" class="btn btn--primary btn--small" style="font-size:14px; padding: 12px 24px;">Request a Quote <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    </section>
` + footer;
        fs.writeFileSync(`service-${svc.filename}.html`, pageHtml);
    }
    console.log("Successfully generated all pages and updated services.html");
} else {
    console.log("Header or footer not found");
}
