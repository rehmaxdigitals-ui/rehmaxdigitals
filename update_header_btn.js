const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let count = 0;

files.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');
    const og = html;

    // Look for <a class="btn btn--outline" href="contact.html">Request a Quote</a>
    // and replace with our new button
    html = html.replace(
        /<a class="btn btn--outline" href="contact\.html">Request a Quote<\/a>/g,
        '<a class="btn btn--primary btn--header-req" href="contact.html">Request Info <i class="fa-solid fa-circle-arrow-right"></i></a>'
    );
    html = html.replace(
        /<a class="btn btn--outline" href="contact\.html">Request a Quote <i class="fa-solid fa-arrow-right"><\/i><\/a>/g,
        '<a class="btn btn--primary btn--header-req" href="contact.html">Request Info <i class="fa-solid fa-circle-arrow-right"></i></a>'
    );

    if (html !== og) {
        fs.writeFileSync(f, html);
        count++;
    }
});

console.log(`Updated header button in ${count} files.`);
