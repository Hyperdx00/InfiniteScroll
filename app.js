let pageNumber = 1;
let pageSize = 10;
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
    type,
    topics,
    levels,

  } = post;
  
  let htmlStr = `
  
    <div class="card-container">
        <div class="card">
          <img src="https://via.placeholder.com/150" alt="Avatar" class="card-img">
            <div class="container-card">
              <div class="card-header">
                    <h4><b>${description}</b></h4>
              </div>
              <div class="card-body">
                
                <p>${url}<p>
                <p>${type}<p>
                <p>${topics}<p>
                <p>${levels}<p>
              </div>
            </div>
        </div>
    </div>
  
`;

  postContainer.insertAdjacentHTML("beforeend", htmlStr);
};

async function getPost(pageNumber, pageSize) {

  let url = `https://api.sampleapis.com/codingresources/codingResources`;
  // let url = `https://api.sampleapis.com/codingresources/codingResources/?id=${pageNumber}&id=${pageSize}`;
  // let url = `https://randomuser.me/api/?page=${pageNumber}&results=${pageSize}&seed=abc`;

  // let url = `https://api.sampleapis.com/codingresources/codingResources`;
  // fetch(url)
  //   .then((resp) => resp.json())
  //   .then((data) => {
  //     // data && data.results && data.results.forEach((post) => renderPost(post));
  //     // console.log(data)

  //     data.forEach((post) => renderPost(post));
  //     console.log(data)

  //     // const result = data.description;
  //     // console.log(result);
  //   });
  

    

  // const post[] = data;


  // if fetch all and convert to object and make parameter using object instead and then return will it work?

  // let pageNumber = 1;
  // let pageSize = data.length;

  const resp = await fetch(url);
  const data = await resp.json();
  return data;

}

const getLastUseEle = () =>
  document.querySelector(".posts__container > .post:last-child");

const loadPost = (pageNumber, pageSize) => {
  return new Promise((resolve, reject) => {
    getPost(pageNumber, pageSize)
      .then((data) => {
        data &&
          data.results &&
          data.results.forEach((post) => renderPost(post));
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
