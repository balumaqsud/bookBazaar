console.log("users js");

$(function () {
  $(".member-status").on("change", (e) => {
    const id = e.target.id,
      memberStatus = $(`#${id}.member-status`).val();
    axios
      .post("/admin/user/edit", {
        _id: id,
        memberStatus: memberStatus,
      })
      .then((response) => {
        const result = response.data;
        if (result.data) {
          console.log("user updated");
          $(".member-status").blur();
        } else alert("user update failed");
      })
      .catch((err) => {
        console.log(err);
        alert("user update failed");
      });
  });
});
