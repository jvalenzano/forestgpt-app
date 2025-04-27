# Forest Service State Information Scraper
# This script generates URLs for all 50 states and provides functionality
# to scrape basic information from the Forest Service website.

import requests
from bs4 import BeautifulSoup
import time
import json
import os
from urllib.parse import urljoin

class ForestServiceStateScraper:
    """
    A class to generate and scrape Forest Service state-specific information
    """
    
    def __init__(self, cache_dir="cache"):
        """Initialize the scraper with basic configuration"""
        self.base_url = "https://www.fs.usda.gov/fs-tags/"
        self.states = [
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
            'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
            'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
            'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
            'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
            'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
            'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
            'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
            'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
            'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ]
        self.cache_dir = cache_dir
        
        # Create cache directory if it doesn't exist
        if not os.path.exists(cache_dir):
            os.makedirs(cache_dir)
    
    def format_state_for_url(self, state_name):
        """Convert state name to format used in Forest Service URLs"""
        return state_name.lower().replace(' ', '-')
    
    def get_state_url(self, state_name):
        """Generate the URL for a specific state"""
        formatted_state = self.format_state_for_url(state_name)
        return f"{self.base_url}{formatted_state}"
    
    def generate_all_state_urls(self):
        """Generate URLs for all 50 states"""
        state_urls = {}
        for state in self.states:
            state_urls[state] = self.get_state_url(state)
        return state_urls
    
    def scrape_state_page(self, state_name, use_cache=True):
        """
        Scrape information from a state's Forest Service page
        
        Args:
            state_name: The name of the state to scrape
            use_cache: Whether to use cached data if available
            
        Returns:
            A dictionary containing the scraped information
        """
        state_url = self.get_state_url(state_name)
        cache_file = os.path.join(self.cache_dir, f"{self.format_state_for_url(state_name)}.json")
        
        # Check if cached data exists and use it if requested
        if use_cache and os.path.exists(cache_file):
            with open(cache_file, 'r') as f:
                return json.load(f)
        
        # Scrape the page with polite waiting
        try:
            print(f"Scraping {state_name} Forest Service information...")
            response = requests.get(state_url, headers={
                'User-Agent': 'ForestGPT Research Bot (educational purposes)',
                'Accept': 'text/html,application/xhtml+xml,application/xml',
                'Accept-Language': 'en-US,en;q=0.9',
            })
            
            # Check if request was successful
            if response.status_code != 200:
                return {
                    "state": state_name,
                    "url": state_url,
                    "error": f"Failed to retrieve page: HTTP {response.status_code}"
                }
            
            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract relevant information
            # Note: These selectors may need adjustment based on actual site structure
            state_info = {
                "state": state_name,
                "url": state_url,
                "title": soup.title.text if soup.title else "Title not found",
                "links": [],
                "content_summary": "",
                "timestamp": time.time()
            }
            
            # Extract main content if available
            main_content = soup.find('div', {'class': 'main-content'})
            if main_content:
                # Extract content summary
                paragraphs = main_content.find_all('p')
                state_info["content_summary"] = " ".join([p.text.strip() for p in paragraphs[:3]])
            
                # Extract relevant links
                links = main_content.find_all('a', href=True)
                for link in links[:10]:  # Limit to 10 links
                    href = link['href']
                    # Convert relative URLs to absolute
                    if href.startswith('/'):
                        href = urljoin("https://www.fs.usda.gov", href)
                    
                    state_info["links"].append({
                        "text": link.text.strip(),
                        "url": href
                    })
            
            # Cache the results
            with open(cache_file, 'w') as f:
                json.dump(state_info, f, indent=2)
            
            # Polite waiting between requests
            time.sleep(1)
            
            return state_info
            
        except Exception as e:
            error_info = {
                "state": state_name,
                "url": state_url,
                "error": str(e)
            }
            return error_info
    
    def scrape_all_states(self, use_cache=True):
        """Scrape information for all 50 states"""
        all_state_info = []
        
        for state in self.states:
            state_info = self.scrape_state_page(state, use_cache)
            all_state_info.append(state_info)
        
        return all_state_info
    
    def export_urls_to_json(self, filename="forest_service_state_urls.json"):
        """Export all state URLs to a JSON file"""
        state_urls = self.generate_all_state_urls()
        
        # Convert to list format for easier use in web applications
        url_list = [{"state": state, "url": url} for state, url in state_urls.items()]
        
        with open(filename, 'w') as f:
            json.dump(url_list, f, indent=2)
        
        print(f"URLs exported to {filename}")
        return filename


# Example usage
if __name__ == "__main__":
    # Initialize the scraper
    scraper = ForestServiceStateScraper()
    
    # Generate and display URLs for all states
    state_urls = scraper.generate_all_state_urls()
    print("Forest Service State-Specific URLs:")
    for state, url in state_urls.items():
        print(f"{state}: {url}")
    
    # Export URLs to JSON
    scraper.export_urls_to_json()
    
    # Example of scraping a specific state
    # Uncomment to test (be mindful of rate limits)
    # california_info = scraper.scrape_state_page("California")
    # print(json.dumps(california_info, indent=2))
    
    # To scrape all states (this will take time and should be used carefully)
    # Uncomment to test (be mindful of rate limits)
    # all_state_info = scraper.scrape_all_states()
    # with open("all_state_info.json", "w") as f:
    #     json.dump(all_state_info, f, indent=2)
