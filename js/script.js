const tabContainer = document.querySelector(".tab-container");
const cardContainer = document.querySelector(".card-container");
const sortByViewsBtn = document.querySelector(".sort-by-views-btn");
const blogBtn = document.querySelector(".blog-btn");
const goToHomeBtn = document.querySelector(".go-to-home-btn");

// Fetch categories from API and create tabs
const fetchCategories = async () => {
    try {
        const response = await fetch(
            "https://openapi.programming-hero.com/api/videos/categories"
        );
        const data = await response.json();
        const categories = data.data;

        let tabsHTML = "";
        categories.forEach((category) => {
            tabsHTML += `<a class="tab" data-category-id="${category.category_id}">${category.category}</a>`;
        });
        tabContainer.innerHTML = tabsHTML;
        // Set default active tab to "All"
        const allTab = document.querySelector(".tab");
        allTab.classList.add("tab-active");
        // Fetch data for default active tab
        await fetchCategoryData(allTab.dataset.categoryId);
    } catch (error) {
        console.error(error);
    }
};

// Add event listener to tabs
tabContainer.addEventListener("click", async (event) => {
    if (event.target.classList.contains("tab")) {
        const clickedTab = event.target;
        // Remove active class from all tabs
        const tabs = document.querySelectorAll(".tab");
        tabs.forEach((tab) => tab.classList.remove("tab-active"));
        // Add active class to clicked tab
        clickedTab.classList.add("tab-active");
        // Fetch data for clicked tab
        await fetchCategoryData(clickedTab.dataset.categoryId);
    }
});

// Fetch data for a category and update cards
const fetchCategoryData = async (categoryId) => {
    try {
        const response = await fetch(
            `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
        );
        const data = await response.json();
        const categoryData = data.data;
        let cardsHTML = "";
        if (categoryData.length === 0) {
            cardsHTML = `
              <div class="no-data">
              <iconify-icon class="text-8xl text-gray-400" icon="mdi:emoticon-sad-outline"></iconify-icon>
                <p class="text-center text-3xl font-bold">Sorry!! Currently, this category has no data!</p>
              </div>
          `;
        } else {
            categoryData.forEach((video) => {
                const thumbnail = video?.thumbnail;
                const title = video?.title;
                const profilePicture = video.authors[0]?.profile_picture;
                const profileName = video.authors[0]?.profile_name;
                const verified = video.authors[0]?.verified;
                const views = video.others?.views;
                const postedDate = video.others?.posted_date
                    ? new Date(video.others.posted_date * 1000)
                    : null;
                const hours = postedDate?.getHours();
                const minutes = postedDate?.getMinutes();
                cardsHTML += `
        <div class="card card-compact w-80 bg-base-100 shadow-xl">
          <figure class="thumbnail-container relative">
            <img class="thumbnail-img w-80 h-48" src="${thumbnail}" alt="${title}" />
            <figcaption class="posted-date absolute bottom-1 right-1 bg-black text-white px-1 rounded-sm">${hours} hrs ${minutes} min ago</figcaption>
          </figure>
          <div class="card-body flex flex-row">
            <div class="user-img w-1/5">
              <img src="${profilePicture}" alt="${profileName}" class="rounded-full w-10 h-10" />
            </div>
            <div class="user-details w-4/5">
              <h2 class="card-title mb-2">${title}</h2>
              <div class="flex">
                <h3 class="user-name mb-2 mr-2">${profileName}</h3>
                ${
                    verified
                        ? '<iconify-icon class="blue-tick text-xl text-blue-600" icon="mdi:tick-circle"></iconify-icon>'
                        : ""
                }
              </div>
              <p class="views">${views} views</p>
            </div>
          </div>
        </div>
      `;
            });
        }
        cardContainer.innerHTML = cardsHTML;
    } catch (error) {
        console.error(error);
    }
};

// Sort cards by views
sortByViewsBtn.addEventListener("click", () => {
    const cards = [...cardContainer.children];
    cards.sort((a, b) => {
        const aViews = parseFloat(
            a.querySelector(".views").innerText.replace(/[^\d.]/g, "")
        );
        const bViews = parseFloat(
            b.querySelector(".views").innerText.replace(/[^\d.]/g, "")
        );
        return bViews - aViews;
    });
    cardContainer.innerHTML = "";
    cards.forEach((card) => cardContainer.appendChild(card));
});

// Redirect to blog.html
blogBtn.addEventListener("click", () => {
    window.location.href = "blog.html";
});

// Fetch categories on page load
fetchCategories();
