let modalOpened = false;
let isEditing = false;
let currentPostIndex = undefined;
const modalWraper = document.getElementById("modal-wrapper");
const postsContainer = document.getElementById("posts");
const actionsForm = document.getElementById("post-form")
const showPostContainer = document.getElementById("show-post")
const formEl = document.forms[0];
const postsToRenderFirst = JSON.parse(localStorage.getItem('posts'));
const getPosts = (() => JSON.parse(localStorage.getItem('posts')));


const postTemplate = ({header,text,postId,createdAt,editedAt = null},templateVariant = null) => {
    const postElement = document.createElement("div");
    const listTemplate = 
    `
    <div>
        <h4>${header}</h4>
        <div>
            <span>Created at:${createdAt}</span>
            ${ editedAt ? `<span>Edited at:${editedAt}</span>` : ""}
        </div>
        <button>Show</button>
    </div>
    `;
    const previewTemplate =
    `
        <h4>${header}</h4>
        <div>
            <span>Created at:${createdAt}</span>
            ${ editedAt ? `<span>Edited at:${editedAt}</span>` : ""}
            <p class="preview__text">${text}</p>
        </div>
        <button>Edit</button>
    `;

    if(templateVariant === "preview"){
        postElement.innerHTML = previewTemplate;
        postElement.querySelector("button").addEventListener("click",(e)=>toggleModal("edit",postId));
        postElement.classList.add("preview");
        return postElement;
    };

    postElement.innerHTML = listTemplate;
    postElement.querySelector("button").addEventListener("click",(e)=>showPostInfo(postId));
    postElement.classList.add("post");
    return postElement;
};


function toggleModal(actionType = undefined,postId = undefined){
    
    modalOpened = actionType !== "edit" ? !modalOpened : modalOpened; 
    isEditing = actionType === "edit" && isFinite(postId);
    modalWraper.style.display = modalOpened ? 'flex' : 'none';

    if(actionType && actionType === "create" || actionType === "edit"){
        formEl[0].focus();
        showPostContainer.style.display = "none"
        actionsForm.style.display = "flex"
        if(isEditing){
            findPostIndex(postId);      
            const savedPosts = getPosts();
            formEl[0].value = savedPosts[currentPostIndex].header;
            formEl[1].value = savedPosts[currentPostIndex].text;
        };
    };
    if(actionType === "show"){
        showPostContainer.style.display = "flex";
    }
    if(!modalOpened){
        if(formEl[0].value.length > 0 || formEl[1].value.length > 0){
            resetFormValues();
        };
        actionsForm.style.display = "flex" ? actionsForm.style.display = "none" : null; 
    };
};

function getFormatedDateString(){
    const now = new Date();
    const month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1; 
    const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
    const date = `${now.getDate()}.${month}.${now.getFullYear()}`;
    const time = `${now.getHours()}:${now.getMinutes()}:${seconds}`;
    return `${date} ${time}`;
};

function findPostIndex(postId){
    const postsArray = getPosts();
    currentPostIndex = 0;
        for (const post of postsArray){
            if(post.postId === postId) break;
            currentPostIndex++;
        };
};

function renderPosts(){
    const fragment = document.createDocumentFragment();
        for (let post of postsToRenderFirst){
            const elem = postTemplate(post);
            fragment.appendChild(elem);
        };
    postsContainer.appendChild(fragment);
};

postsToRenderFirst?.length > 0 && renderPosts();
