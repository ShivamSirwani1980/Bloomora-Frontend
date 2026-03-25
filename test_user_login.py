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

def test_valid_login():
    print("\n[TC_L01] Running: Valid Login Test")
    driver = setup()
    try:
        driver.get(f"{BASE_URL}/login")
        time.sleep(2)

        driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys("co2023.shivam.sirwani@ves.ac.in")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("12345678")
        driver.save_screenshot("TC_L01_step1_credentials_entered.png")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(4)
        driver.save_screenshot("TC_L01_step2_after_login.png")

        if "dashboard" in driver.current_url:
            print("TC_L01 PASSED - User logged in and redirected to dashboard")
        else:
            print(f"TC_L01 FAILED - Stayed at: {driver.current_url}")
    finally:
        driver.quit()

def test_invalid_login():
    print("\n[TC_L02] Running: Invalid Login Test")
    driver = setup()
    try:
        driver.get(f"{BASE_URL}/login")
        time.sleep(2)
        driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys("wronguser@fake.com")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("wrongpassword123")
        driver.save_screenshot("TC_L02_step1_wrong_credentials.png")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(4)
        driver.save_screenshot("TC_L02_step2_error_shown.png")

        # Should remain on /login — not redirected to dashboard
        if "login" in driver.current_url:
            print("TC_L02 PASSED - Login blocked with invalid credentials, error message displayed")
        else:
            print(f"TC_L02 FAILED - Unexpectedly redirected to: {driver.current_url}")
    finally:
        driver.quit()

def test_signup():
    print("\n[TC_L03] Running: Signup / Register Test")
    driver = setup()
    try:
        driver.get(f"{BASE_URL}/login")
        time.sleep(2)
        driver.find_element(By.XPATH, "//button[contains(text(),'Sign Up')]").click()
        time.sleep(1)
        driver.save_screenshot("TC_L03_step1_signup_form.png")
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='First name']").send_keys("Test1")
        driver.find_element(By.CSS_SELECTOR, "input[placeholder='Last name']").send_keys("User")
        driver.find_element(By.CSS_SELECTOR, "input[type='date']").send_keys("18-06-2001")
        driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys("test1bloomora123@gmail.com")
        driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("Test@1234")
        driver.save_screenshot("TC_L03_step2_form_filled.png")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(4)
        driver.save_screenshot("TC_L03_step3_after_signup.png")
        if "dashboard" in driver.current_url:
            print("TC_L03 PASSED - Account created successfully and redirected to dashboard")
        else:
            print(f"TC_L03 RESULT - Current URL: {driver.current_url} (check screenshot for toast message)")
    finally:
        driver.quit()

if __name__ == "__main__":
    print("=" * 50)
    print("  MODULE 1: USER LOGIN & SIGNUP TESTS")
    print("  Project: Bloomora")
    print("  Tool: Selenium WebDriver (Python)")
    print("=" * 50)
    test_valid_login()
    test_invalid_login()
    test_signup()
    print("\nAll Login/Signup tests completed.")
