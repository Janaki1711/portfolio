const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
    try {
        console.log('Launching browser...');
        
        let executablePath = '';
        const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
        const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        
        if (fs.existsSync(edgePath)) {
            executablePath = edgePath;
        } else if (fs.existsSync(chromePath)) {
            executablePath = chromePath;
        } else {
            throw new Error('Could not find Edge or Chrome on this PC.');
        }
        
        console.log(`Using browser at: ${executablePath}`);
        
        const browser = await puppeteer.launch({ executablePath });
        const page = await browser.newPage();
        
        // Get the absolute path to the HTML file
        const filePath = path.resolve('portfolio.html');
        const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
        
        console.log(`Loading page: ${fileUrl}`);
        
        // Load the HTML file, wait until all resources are fully loaded
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });
        
        console.log('Generating PDF...');
        // Generate PDF
        await page.pdf({
            path: 'portfolio.pdf',
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });
        
        await browser.close();
        console.log('Successfully generated portfolio.pdf!');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
})();
