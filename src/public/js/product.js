console.log("Products frontend javascript file");
$(function () {
  $("1").on("click", function () {
    $("#file").val();
  });

  $("#process-btn").on("click", () => {
    $(".book-container").slideToggle(500);
    $("#process-btn").css("display", "none");
  });

  $("#cancel-btn").on("click", () => {
    $(".book-container").slideToggle(100);
    $("#process-btn").css("display", "flex");
  });

  //product status change
  $(".new-product-status").on("change", async function (e) {
    const id = e.target.id,
      productStatus = $(`#${id}.new-product-status`).val();

    try {
      const response = await axios.post(`/admin/product/${id}`, {
        productStatus: productStatus,
      });
      const result = response.data;
      if (result.data) {
        console.log("product updated");
        $(".new-product-status").blur();
      } else alert("product update failed");
    } catch (error) {
      console.log(error);
      alert("product updates failed");
    }
  });
});
//image preview

function previewProductPhoto(input, order) {
  const imageClass = input.className,
    file = $(`.${imageClass}`).get(0).files[0],
    fileType = file["type"],
    validImages = ["image/jpg", "image/jpeg", "image/png"];

  if (!validImages.includes(fileType)) {
    alert("Insert only JPG, PNG, JPEG");
  } else {
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        $(`#image-section-${order}`).attr("src", reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
}

// frontend validation for form
function validateForm() {
  const productName = $(".product-name").val(),
    productStatus = $(".product-status").val(),
    productPrice = $(".product-price").val(),
    productLeftCount = $(".product-left-count").val(),
    productType = $(".product-type").val(),
    productCategory = $(".product-category").val(),
    productDesc = $(".product-desc").val();

  if (
    productName === "" ||
    productStatus === "" ||
    productPrice === "" ||
    productLeftCount === "" ||
    productType === "" ||
    productCategory === "" ||
    productDesc === ""
  ) {
    alert("Please, fill in all details of the product!");
    return false;
  } else return true;
}
