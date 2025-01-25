document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const cryptoContent = document.getElementById("crypto-content");
  const cryptoIcon = document.getElementById("crypto-icon");
  const cryptoName = document.getElementById("crypto-name");

  let selectedCoin = document
    .querySelector(".tab-button.active")
    .getAttribute("data-coin");
  updateCoinData(selectedCoin);
  setInterval(() => updateCoinData(selectedCoin), 1000); // Refresh every 1 second

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove 'active' class from all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      // Add 'active' class to clicked button
      this.classList.add("active");

      selectedCoin = this.getAttribute("data-coin");
      updateCoinData(selectedCoin);
      // Update Icon and Name
      cryptoIcon.src = this.getAttribute("data-icon");
      cryptoName.textContent = this.getAttribute("data-name");
      // Update Accent Color
      updateAccentColor(selectedCoin);
    });
  });

  function updateAccentColor(symbol) {
    let accentColor = "#3498db"; // Default color
    switch (symbol) {
      case "ETHUSDT":
        accentColor = "#627eea"; // Ethereum purple
        break;
      case "BTCUSDT":
        accentColor = "#f7931a"; // Bitcoin orange
        break;
      case "ARBUSDT":
        accentColor = "#2a6cff"; // Arbitrum blue
        break;
      case "OPUSDT":
        accentColor = "#ff0420"; // Optimism red
        break;
      case "STRKUSDT":
        accentColor = "#1e90ff"; // Stark blue
        break;
      case "ENAUSDT":
        accentColor = "#000000"; // Black
        break;
    }
    cryptoContent.style.borderTopColor = accentColor;
    // Update active tab bottom border color
    document.querySelector(".tab-button.active").style.borderBottomColor =
      accentColor;
  }

  function updateCoinData(symbol) {
    fetchMarkPriceData(symbol);
    fetchTickerData(symbol);
  }

  function fetchMarkPriceData(symbol) {
    const url = `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const priceElement = document.getElementById("price");
        const fundingRateElement = document.getElementById("fundingRate");
        const nextFundingTimeElement =
          document.getElementById("nextFundingTime");

        const markPrice = parseFloat(data.markPrice).toFixed(4);
        const fundingRate = (parseFloat(data.lastFundingRate) * 100).toFixed(4);
        const nextFundingTime = new Date(
          data.nextFundingTime
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const timeDiff = data.nextFundingTime - Date.now();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const nextFundingIn = `in ${hours}h ${minutes}m`;

        priceElement.textContent = `$${markPrice}`;
        fundingRateElement.textContent = `${fundingRate}%`;
        nextFundingTimeElement.textContent = nextFundingIn;
        nextFundingTimeElement.setAttribute(
          "data-tooltip",
          `At ${nextFundingTime}`
        );
      })
      .catch((error) => {
        console.error(`Error fetching ${symbol} mark price:`, error);
        document.getElementById("price").textContent = "Error";
      });
  }

  function fetchTickerData(symbol) {
    const url = `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const priceChangeElement = document.getElementById("priceChange");
        const highPriceElement = document.getElementById("highPrice");
        const lowPriceElement = document.getElementById("lowPrice");
        const volumeElement = document.getElementById("volume");

        const priceChange = parseFloat(data.priceChange).toFixed(4);
        const priceChangePercent = parseFloat(data.priceChangePercent).toFixed(
          4
        );
        const highPrice = parseFloat(data.highPrice).toFixed(4);
        const lowPrice = parseFloat(data.lowPrice).toFixed(4);
        const volume = parseFloat(data.volume).toLocaleString();

        const isPositive = parseFloat(data.priceChange) >= 0;

        priceChangeElement.textContent = `${
          isPositive ? "+" : ""
        }$${priceChange} (${priceChangePercent}%)`;
        priceChangeElement.classList.remove("positive", "negative");
        priceChangeElement.classList.add(isPositive ? "positive" : "negative");
        highPriceElement.textContent = `$${highPrice}`;
        lowPriceElement.textContent = `$${lowPrice}`;
        volumeElement.textContent = `${volume} ${symbol.replace("USDT", "")}`;
      })
      .catch((error) => {
        console.error(`Error fetching ${symbol} 24hr ticker data:`, error);
        document.getElementById("priceChange").textContent = "Error";
      });
  }

  // Initial Accent Color
  updateAccentColor(selectedCoin);
});

document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-button');
  let currentIndex = 0;

  // Find the initially active tab (if any)
  tabButtons.forEach((btn, idx) => {
    if (btn.classList.contains('active')) {
      currentIndex = idx;
    }
  });

  document.addEventListener('keydown', (event) => {
    // Check if the Tab key was pressed
    if (event.key === 'Tab') {
      // Prevent default tab navigation
      event.preventDefault();

      // If Shift is held, go backward
      if (event.shiftKey) {
        currentIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      } else {
        currentIndex = (currentIndex + 1) % tabButtons.length;
      }

      // Programmatically "click" the next/previous tab button
      tabButtons[currentIndex].click();
      // Move focus to it (optional for better UX)
      tabButtons[currentIndex].focus();
    }
  });
});
