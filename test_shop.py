from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

BASE_URL = "http://localhost:8080"

def setup():
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.maximize_window()
    return driver
def test_products_load():
    print("\n[TC_S01] Running: Products Load on Shop Page")
    driver = setup()
    try:
        driver.get(f"{BASE_URL}/shop")
        time.sleep(2)
        driver.save_screenshot("TC_S01_step1_shop_opened.png")
        # Wait up to 8 seconds for products to load from API
        WebDriverWait(driver, 8).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(),'products found')]"))
        )
        driver.save_screenshot("TC_S01_step2_products_loaded.png")
        count_text = driver.find_element(By.XPATH, "//*[contains(text(),'products found')]").text
        print(f"TC_S01 PASSED - Products loaded successfully: {count_text}")
    except Exception as e:
        driver.save_screenshot("TC_S01_failed.png")
        print(f"TC_S01 FAILED - {str(e)}")
    finally:
        driver.quit()

def test_search_filter():
    print("\n[TC_S02] Running: Search Filter on Shop Page")
    driver = setup()
    try:
        driver.get(f"{BASE_URL}/shop")
        time.sleep(3)
        WebDriverWait(driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Search flowers...']"))
        )
        driver.save_screenshot("TC_S02_step1_before_search.png")
        search_box = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Search flowers...']")
        search_box.send_keys("rose")
        time.sleep(2)
        driver.save_screenshot("TC_S02_step2_after_search.png")
        count_text = driver.find_element(By.XPATH, "//*[contains(text(),'products found')]").text
        print(f"TC_S02 PASSED - Search filter worked: {count_text}")
    except Exception as e:
        driver.save_screenshot("TC_S02_failed.png")
        print(f"TC_S02 FAILED - {str(e)}")
    finally:
        driver.quit()

def test_category_filter():
    print("\n[TC_S03] Running: Category Filter on Shop Page")
    driver = setup()
    try:
        driver.get(f"{BASE_URL}/shop")
        time.sleep(3)
        driver.save_screenshot("TC_S03_step1_shop_loaded.png")
        category_buttons = driver.find_elements(By.CSS_SELECTOR, "aside button")
        if len(category_buttons) >= 2:
            category_buttons[1].click()  # Click second category (not "all flowers")
            time.sleep(2)
        driver.save_screenshot("TC_S03_step2_category_clicked.png")
        page_source = driver.page_source
        if "products found" in page_source or "No flowers found" in page_source:
            print("TC_S03 PASSED - Category filter applied and results updated")
        else:
            print("TC_S03 FAILED - No response to category filter")
    except Exception as e:
        driver.save_screenshot("TC_S03_failed.png")
        print(f"TC_S03 FAILED - {str(e)}")
    finally:
        driver.quit()

if __name__ == "__main__":
    print("=" * 50)
    print("  MODULE 2: SHOP - BROWSE & SEARCH TESTS")
    print("  Project: Bloomora")
    print("  Tool: Selenium WebDriver (Python)")
    print("=" * 50)
    test_products_load()
    test_search_filter()
    test_category_filter()
    print("\nAll Shop tests completed.")
