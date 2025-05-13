# Opt Out Scanner

The **Opt Out Scanner** is a simple web application that scans websites for links related to privacy policies, opt-out options, cookies, and data selling. It uses **Puppeteer** to automate the scanning of web pages and returns links to relevant privacy-related pages.

## Features

- Scans any website URL for privacy policy, opt-out options, cookie policies, and links related to data selling.
- Displays the relevant links on the frontend, such as:
  - Privacy Policy
  - Opt-Out or Do Not Sell links
  - Other relevant privacy-related links

## Technologies

- **Backend**:
  - Node.js with **Express** for the server
  - **Puppeteer** for headless browser scraping
  - **CORS** to enable cross-origin requests
- **Frontend**:
  - Simple HTML and JavaScript to create the user interface
  - Fetch API to interact with the backend server

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/alisherbegmatov/opt-out-scanner.git
cd opt-out-scanner
```
