const men_section = document.querySelector(".men");
const women_section = document.querySelector(".women");
const kids_section = document.querySelector(".kids");
const home_section = document.querySelector(".homeliving");
const beauty_section = document.querySelector(".beauty");
const colortheory_section = document.querySelector(".colortheory");

const men_section_items = document.querySelector(".men-section-items");
const women_section_items = document.querySelector(".women-section-items");
const kids_section_items = document.querySelector(".kids-section-items");
const home_section_items = document.querySelector(".home-section-items");
const beauty_section_items = document.querySelector(".beauty-section-items");
const colortheory_section_items = document.querySelector(
  ".colortheory-section-items"
);
const container_ele = document.querySelector(".container");
var bodyele = document.getElementsByTagName("BODY");

men_section.onmouseover = () => {
  men_section_items.classList.remove("visibility");
};
men_section.onmouseout = () => {
  men_section_items.classList.add("visibility");
}; /* men section ends here */

women_section.onmouseover = () => {
  women_section_items.classList.remove("visibility");
};
women_section.onmouseout = () => {
  women_section_items.classList.add("visibility");
}; /* women section ends here */

kids_section.onmouseover = () => {
  kids_section_items.classList.remove("visibility");
};
kids_section.onmouseout = () => {
  kids_section_items.classList.add("visibility");
}; /* kids section ends here */

home_section.onmouseover = () => {
  home_section_items.classList.remove("visibility");
};
home_section.onmouseout = () => {
  home_section_items.classList.add("visibility");
}; /* home and living ends here */

beauty_section.onmouseover = () => {
  beauty_section_items.classList.remove("visibility");
};
beauty_section.onmouseout = () => {
  beauty_section_items.classList.add("visibility");
};
colortheory_section.onmouseover = () => {
  colortheory_section_items.classList.remove("visibility");
};
colortheory_section.onmouseout = () => {
  colortheory_section_items.classList.add("visibility");
};

document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");
  const imageContainer = document.getElementById("imageContainer");
  const colorPicker = document.getElementById("colorPicker");
  const paletteOutput = document.getElementById("paletteOutput");
  const imageResults = document.getElementById("imageResults");

  uploadForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      fetch("/upload-image", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            const imgElement = document.createElement("img");
            imgElement.src = URL.createObjectURL(file);
            imgElement.onload = function () {
              URL.revokeObjectURL(this.src);
            };
            imageContainer.innerHTML = "";
            imageContainer.appendChild(imgElement);

            // Display the color palette
            const paletteDiv = document.createElement("div");
            paletteDiv.className = "palette";

            data.palette.forEach((color) => {
              const colorDiv = document.createElement("div");
              colorDiv.className = "color-box";
              colorDiv.style.backgroundColor = color;
              paletteDiv.appendChild(colorDiv);
            });

            paletteOutput.innerHTML = "";
            paletteOutput.appendChild(paletteDiv);
            paletteOutput.innerHTML = "";
            paletteOutput.appendChild(paletteDiv);

            // Display palettes and images
            displayPalettesAndImages(data);
          }
        });
    }
  });

  colorPicker.addEventListener("input", function (event) {
    const color = event.target.value;
    fetch("/generate-palettes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ base_color: color }),
    })
      .then((response) => response.json())
      .then((data) => {
        paletteOutput.innerHTML = "";
        displayPalettesAndImages(data);
      });
  });

  function displayPalettesAndImages(data) {
    paletteOutput.innerHTML = "";

    for (const [paletteName, colors] of Object.entries(data.images)) {
      const paletteDiv = document.createElement("div");
      paletteDiv.className = "palette";

      const paletteTitle = document.createElement("h3");
      paletteTitle.textContent = paletteName;
      paletteDiv.appendChild(paletteTitle);

      for (const color in colors) {
        const colorDiv = document.createElement("div");
        colorDiv.className = "color-box";
        colorDiv.style.backgroundColor = color;
        paletteDiv.appendChild(colorDiv);

        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container";
        colors[color].forEach((imagePath) => {
          const img = document.createElement("img");
          img.src = imagePath;
          img.alt = color;
          img.className = "palette-image";
          imageContainer.appendChild(img);
        });
        paletteDiv.appendChild(imageContainer);
      }

      paletteOutput.appendChild(paletteDiv);
    }
  }
});
