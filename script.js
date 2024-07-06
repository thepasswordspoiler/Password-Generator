// JavaScript for saving/loading preferences to/from local storage
const lengthSlider = document.getElementById("lengthSlider");
const options = document.querySelectorAll(".options input");
const copyIcon = document.getElementById("copyIcon");
const passwordInput = document.getElementById("passwordInput");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.querySelector(".generate-btn");
const ipAddressElement = document.getElementById("ipAddress");
const currentTimeElement = document.getElementById("currentTime");

const characters = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-="
};

// Function to get IP address
const getIPAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.log("Error fetching IP address:", error.message);
    return "N/A";
  }
};

// Function to display current time
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false });
};

const updatePasswordIndicator = () => {
  const strength = passwordInput.value.length / lengthSlider.value;
  passIndicator.style.width = `${strength * 100}%`;

  passIndicator.className = "";
  if (strength < 0.3) {
    passIndicator.classList.add("weak");
  } else if (strength < 0.7) {
    passIndicator.classList.add("medium");
  } else {
    passIndicator.classList.add("strong");
  }
};

const generatePassword = () => {
  let password = "";
  const availableOptions = [];
  let selectedOptionsCount = 0;

  options.forEach(option => {
    if (option.checked) {
      availableOptions.push(characters[option.id]);
      selectedOptionsCount++;
    }
  });

  if (availableOptions.length === 0) {
    alert("Please select at least one option.");
    return;
  }

  for (let i = 0; i < lengthSlider.value; i++) {
    let randomOption = "";
    
    // Ensure randomOption is defined and not empty
    while (randomOption === "") {
      randomOption = availableOptions[Math.floor(Math.random() * selectedOptionsCount)];
    }

    const randomCharacter = randomOption.charAt(Math.floor(Math.random() * randomOption.length));
    password += randomCharacter;
  }

  password = shuffleString(password);

  if (document.getElementById("avoidSimilar").checked) {
    password = password.replace(/[O0l1]/g, ''); // Example replacement of similar characters
  }

  passwordInput.value = password;
  updatePasswordIndicator();

  const strength = getPasswordStrength(password);
  if (strength === "Weak") {
    alert("Warning: Your password may be weak. Consider increasing its length or adding more character types.");
  }
};

const copyPassword = () => {
  navigator.clipboard.writeText(passwordInput.value);
  copyIcon.innerHTML = '<i class="fas fa-check"></i>';
  setTimeout(() => {
    copyIcon.innerHTML = '<i class="far fa-copy"></i>';
  }, 1500);
};

const shuffleString = (str) => {
  const array = str.split('');
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array.join('');
};

const getPasswordStrength = (password) => {
  // Implement your own strength assessment logic here
  // Example: Check length and character types
  if (password.length < 8) {
    return "Weak";
  } else if (password.length < 12) {
    return "Medium";
  } else {
    return "Strong";
  }
};

getIPAddress().then(ip => {
  ipAddressElement.textContent = ip;
}).catch(error => {
  console.log("Error initializing IP address:", error.message);
  ipAddressElement.textContent = "N/A";
});

currentTimeElement.textContent = getCurrentTime();

generateBtn.addEventListener("click", generatePassword);
copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", generatePassword);
lengthSlider.addEventListener("input", () => {
  document.getElementById("lengthValue").textContent = lengthSlider.value;
});

options.forEach(option => {
  option.addEventListener("change", updatePasswordIndicator);
});
