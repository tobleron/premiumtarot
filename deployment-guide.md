# Premium Tarot Website - GitHub Pages Deployment Guide

This document provides step-by-step instructions for deploying the Premium Tarot website to GitHub Pages.

## Option 1: Deploy Pre-built Distribution Files (Recommended)

This is the simplest approach as all files are already optimized and ready for deployment.

1. **Create a GitHub Repository**
   - Log in to your GitHub account
   - Create a new repository named `premium-tarot` (or any name you prefer)
   - Make sure the repository is public if you're using the free GitHub Pages

2. **Deploy the Distribution Files**
   - Extract the `premium-tarot-dist.zip` file to your local machine
   - Rename the `dist` folder to `docs` (GitHub Pages can serve from this folder)
   - Upload the contents to your GitHub repository:
     ```
     git clone https://github.com/yourusername/premium-tarot.git
     cd premium-tarot
     # Copy all files from the extracted 'docs' folder to this directory
     git add .
     git commit -m "Initial website deployment"
     git push origin main
     ```

3. **Configure GitHub Pages**
   - Go to your repository on GitHub
   - Click on "Settings" > "Pages"
   - Under "Source", select "main" branch and "/docs" folder
   - Click "Save"
   - Your site will be published at `https://yourusername.github.io/premium-tarot/`

## Option 2: Deploy from Source Code

If you want to make changes to the website before deployment:

1. **Set Up Development Environment**
   - Make sure you have Node.js installed (version 14 or higher)
   - Extract the `premium-tarot-source.zip` file to your local machine
   - Open a terminal in the extracted folder
   - Install dependencies:
     ```
     npm install
     ```

2. **Make Your Changes**
   - Modify the files in the `src` directory as needed
   - Test your changes locally:
     ```
     npx parcel src/index.html
     ```
   - Open `http://localhost:1234` in your browser to see the changes

3. **Build for Production**
   - Run the build command:
     ```
     npx parcel build src/index.html --public-url ./
     ```
   - This will create optimized files in the `dist` directory

4. **Deploy to GitHub Pages**
   - Create a GitHub repository as described in Option 1
   - Push your code to GitHub:
     ```
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin https://github.com/yourusername/premium-tarot.git
     git push -u origin main
     ```
   - Configure GitHub Pages to serve from the `dist` folder or copy the contents of `dist` to a `docs` folder and configure GitHub Pages to serve from there

## Customizing WhatsApp Integration

Before deploying, make sure to update the WhatsApp number in the following files:

1. Open `src/assets/js/checkout-verification.js` and replace `YOUR_WHATSAPP_NUMBER` with your actual WhatsApp business number
2. Open `src/pages/contact.html` and update the WhatsApp link
3. Open `src/pages/checkout.html` and update the WhatsApp link in the footer

## Maintenance

To update the website after deployment:

1. Make changes to the source code
2. Rebuild the project with `npx parcel build src/index.html --public-url ./`
3. Replace the files in your GitHub repository with the new build files
4. Commit and push the changes

## Support

If you encounter any issues or need assistance with the deployment, please contact us through WhatsApp.
