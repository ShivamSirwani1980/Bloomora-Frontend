from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
BASE_URL = "http://localhost:8080"

print("=== MODULE 3: CHECKOUT TESTS ===")
print("Running TC_C01: Without Login")

driver.get(f"{BASE_URL}/checkout")
time.sleep(3)
driver.save_screenshot("TC_C01.png")
print("Logging in for further tests")
driver.get(f"{BASE_URL}/login")
time.sleep(2)
driver.find_element(By.XPATH, "//input[@placeholder='your@email.com']").send_keys("co2023.shivam.sirwani@ves.ac.in")
driver.find_element(By.XPATH, "(//input[@type='password'])[1]").send_keys("12345678")
driver.find_element(By.XPATH, "//button[contains(text(),'Sign In')]").click()
time.sleep(3)
print("Adding product to cart")

driver.get(f"{BASE_URL}/shop")
time.sleep(3)
driver.find_element(By.XPATH, "(//button[contains(text(),'Add')])[1]").click()
time.sleep(2)
driver.get(f"{BASE_URL}/checkout")
time.sleep(3)
print("Running TC_C02: Empty Address Validation")
time.sleep(2)
try:
    pay_button = driver.find_element(By.XPATH, "//button[contains(text(),'Pay') or contains(text(),'Securely')]")
    pay_button.click()
    time.sleep(2)
    page_text = driver.page_source

    if "address" in page_text.lower() or "fill" in page_text.lower():
        print("TC_C02 PASSED - Validation message displayed")
    else:
        print("TC_C02 FAILED - No validation message found")

    driver.save_screenshot("TC_C02.png")

except Exception as e:
    print("TC_C02 FAILED - Pay button not found")
    print(e)

print("Running TC_C03: Checkout Page Load")

time.sleep(2)

page_text = driver.page_source

missing = []

if "Delivery Address" not in page_text:
    missing.append("Delivery Address")

if "Order Summary" not in page_text:
    missing.append("Order Summary")

if "Total" not in page_text:
    missing.append("Total")

if "Razorpay" not in page_text:
    missing.append("Razorpay")

if len(missing) == 0:
    print("TC_C03 PASSED - All sections present")
else:
    print(f"TC_C03 FAILED - Missing sections: {missing}")

driver.save_screenshot("TC_C03.png")

print("Checkout Module Completed")
driver.quit()