const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("login-container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// other
console.log("Signup frontend javascript file");

$(function () {
  const fileTarget = $(".image-upload .member-image");
  let fileName;

  fileTarget.on("change", function () {
    if (window.FileReader) {
      const fileInput = $(this)[0];

      if (!fileInput.files || fileInput.files.length === 0) {
        console.warn("No file selected or input.files is undefined.");
        return;
      }
      const uploadFile = fileInput.files[0];
      const fileType = uploadFile["type"];
      const validImage = ["image/jpg", "image/jpeg", "image/png"];

      if (!validImage.includes(fileType)) {
        alert("Insert only JPG, PNG, JPEG");
      } else {
        if (uploadFile) {
          console.log(URL.createObjectURL(uploadFile));
          $(".upload-img")
            .attr("src", URL.createObjectURL(uploadFile))
            .addClass("success");
        }
        fileName = $(this)[0].files[0].name;
      }
    }
  });
});

function validateSignupForm() {
  const memberNick = $(".memberNick").val();
  const memberPhone = $(".memberEmail").val();
  const memberPassword = $(".memberPassword").val();

  if (memberNick === "" || memberPhone === "" || memberPassword === "") {
    alert("Please, fill in all inputs!");
    return false;
  }

  const memberImage = $(".member-image").get(0).files[0]
    ? $(".member-image").get(0).files[0].name
    : null;
  if (!memberImage) {
    alert("Please, insert Profile image!");
    return false;
  }
}
