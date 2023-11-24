let pageNumber = 1;
// let pageSize2 = pagesize;
let isPageLoad = true;
const postContainer = document.querySelector(".posts__container");
const loadingEle = document.querySelector("#loading");

const toggleLoading = (isLoading) => {
  loadingEle.classList.toggle("show", isLoading);
};

const renderPost = (post) => {
  let {
    id,
    description,
    url,
    types,
    topics,
    levels,

  } = post;

  let htmlStr = `
  
        <div class="card">
          <img src="https://via.placeholder.com/150" alt="Avatar" class="card-img">
            <div class="container-card">
              <div class="card-header">
                    <h4><b>${description}</b></h4>
              </div>
              <div class="card-body">
                <p>${id}<p>
                <p>${url}<p>
                <p>${types}<p>
                <p>${topics}<p>
                <p>${levels}<p>
              </div>
            </div>
        </div>  

`;

  postContainer.insertAdjacentHTML("beforeend", htmlStr);
};

async function getPost() {

  let url = `https://api.sampleapis.com/codingresources/codingResources`;

  const resp = await fetch(url);
  const data = await resp.json();
  console.log(data)
  return data;
  

}

const getLastUseEle = () =>
  document.querySelector(".posts__container > .post:last-child");

const loadPost = (pageNumber, pageSize) => {
  return new Promise((resolve, reject) => {
    getPost(pageNumber, pageSize)
      .then((data) => {
        data.forEach((post) => renderPost(post));
        console.log(data)
        const post2 = data;

        console.log(post2);

        for (let i = 0; i < post2.length; i += 4) {
          let pageSize = post2.slice(i, i + 4);
          console.log(pageSize);
        }
        // return pageSize;

        if (isPageLoad) {
          obseveLastPost();
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
loadPost(pageNumber, pageSize)
  .then((data) => {
    toggleLoading(false);
  })
  .catch((error) => toggleLoading(false));

const infScrollCallback = (entries, observer) => {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  pageNumber += 1;
  toggleLoading(true);
  loadPost(pageNumber, pageSize)
    .then((resp) => {
      obseveLastPost();
      toggleLoading(false);
    })
    .catch((error) => toggleLoading(false));
  observer.unobserve(entry.target);
};

const infScrollObserver = new IntersectionObserver(infScrollCallback, {});

const obseveLastPost = () => {
  infScrollObserver.observe(getLastUseEle());
};
