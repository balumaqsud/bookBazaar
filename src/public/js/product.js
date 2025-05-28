console.log("Products frontend javascript file");
$(function () {
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
