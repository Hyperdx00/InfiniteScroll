let pageNumber = 1;
let pageSize = 10;
let isPageLoad = true;
const userContainer = document.querySelector(".users__container");
const loadingEle = document.querySelector("#loading");

const toggleLoading = (isLoading) => {
  loadingEle.classList.toggle("show", isLoading);
};

const renderUser = (user) => {
  let {
    description,
    url,
    type: { tutorial },
    topics,
    levels,

  } = user;
  let htmlStr = `
  <div class="user">
    <div class="card-container">
    
        <div class="card">
          <img src="https://via.placeholder.com/150" alt="Avatar" class="card-img">
            <div class="container-card">
              <div class="card-header">
                    <h4><b>${description}</b></h4>
              </div>
              <div class="card-body">
                <p>${url}<p>
                <p>${tutorial}<p>
                <p>${topics}<p>
                <p>${levels}<p>
              </div>
            </div>
        </div>

    </div>
  </div>
`;

  userContainer.insertAdjacentHTML("beforeend", htmlStr);
};

async function getRandomUsers(informations) {
  
  let url = `https://api.sampleapis.com/codingresources/codingResources`;
  // fetch(url)
  //   .then((resp) => resp.json())
  //   .then((data) => {
  //     data && data.results && data.results.forEach((user) => renderUser(user));
  //     console.log(data)
  //   });
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
  
}

const getLastUseEle = () =>
  document.querySelector(".users__container > .user:last-child");

const loadUsers = (informations) => {
  return new Promise((resolve, reject) => {
    getRandomUsers(informations)
      .then((data) => {
        data &&
          data.results &&
          data.results.forEach((user) => renderUser(user));
        if (isPageLoad) {
          obseveLastUser();
          isPageLoad = false;
        }
        resolve("Completed Rendering");
      })
      .catch((error) => {
        reject(error);
      });
  });
};
toggleLoading(true);
loadUsers(informations)
  .then((data) => {
    toggleLoading(false);
  })
  .catch((error) => toggleLoading(false));

const infScrollCallback = (entries, observer) => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  informations += 1;
  toggleLoading(true);
  loadUsers(informations)
    .then((resp) => {
      obseveLastUser();
      toggleLoading(false);
    })
    .catch((error) => toggleLoading(false));
  observer.unobserve(entry.target);
};

const infScrollObserver = new IntersectionObserver(infScrollCallback, {});

const obseveLastUser = () => {
  infScrollObserver.observe(getLastUseEle());
};
