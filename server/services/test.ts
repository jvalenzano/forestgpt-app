import fetch from "node-fetch";

/**
 * Test function to check if we can scrape content from the Forest Service website
 */
export async function testScrapeForestService() {
  try {
    const urls = [
      "https://www.fs.usda.gov",
      "https://www.fs.usda.gov/visit",
      "https://www.fs.usda.gov/about-agency"
    ];
    
    console.log("Starting test scrape of Forest Service website...");
    
    for (const url of urls) {
      console.log(`Testing URL: ${url}`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const html = await response.text();
        
        console.log(`URL: ${url}`);
        console.log(`Status: ${response.status}`);
        console.log(`Content length: ${html.length} characters`);
        console.log(`Content preview: ${html.substring(0, 200)}...`);
        console.log("---");
      } catch (error) {
        console.error(`Error testing URL ${url}:`, error);
      }
    }
    
    console.log("Test scrape completed");
  } catch (error) {
    console.error("Error running test scrape:", error);
  }
}