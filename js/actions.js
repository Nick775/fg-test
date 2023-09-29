function submitModalForm(event){
    event.preventDefault();
    !isEditing ? createPost() : editPost();
};

const resetFormValues = () => {
    formEl[0].value = "";
    formEl[1].value = "";
};

function createPost(){
    const savedPosts = getPosts();
    const header = formEl[0].value;
    const text = formEl[1].value;
    if(header === "" && text === "") {
        resetFormValues(); 
        return toggleModal()
    };
        const postId = savedPosts?.length > 0 ? savedPosts[savedPosts.length - 1].postId + 1  : 1;
        const createdAt = getFormatedDateString();
        const newPost = {header,text,postId,createdAt};
        const newPostsArray = savedPosts?.length > 0 ? [...savedPosts,newPost] : [newPost];
       
        localStorage.setItem("posts", JSON.stringify(newPostsArray));
       
        const elementToRender = postTemplate(newPost);
        postsContainer.appendChild(elementToRender);
       
        toggleModal();
};

function editPost(){
    const savedPosts = structuredClone(getPosts());
    const editingPost = savedPosts[currentPostIndex];
    editingPost.editedAt = getFormatedDateString();
    editingPost.header = formEl[0].value;
    editingPost.text = formEl[1].value;
    savedPosts[currentPostIndex] = editingPost;

    localStorage.setItem("posts",JSON.stringify(savedPosts));
    
    const postTemplateClone = postTemplate(editingPost);
    postsContainer.replaceChild(postTemplateClone, postsContainer.children[currentPostIndex]);

    currentPostIndex = undefined;
    isEditing = false;
    
    toggleModal();
};

function showPostInfo (id) {
    showPostContainer.innerHTML = "";
    const posts = getPosts();
    findPostIndex(id);
    toggleModal("show");
    const templateEl = postTemplate(posts[currentPostIndex],"preview");
    showPostContainer.appendChild(templateEl);
}
