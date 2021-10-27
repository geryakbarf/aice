var app = new Vue({
  el : '#form-karyawan-update',
  data : {
    form : {
      nip : null,
      id_bagian : 0,
      nama : null,
      email : null,
      jabatan : null,
      photo : null,
      alamat : null,
      nomor_kontak : null
    }, //endform
    bagian : [],
    photoChanged : false
  }, //enddata
  methods : {
    loadBagian : async function (){
      try{
        let res = await fetch('/api/get-bagian');
        let data = await res.json();
        this.bagian = data;
      } catch (err){
        console.log(err);
      }
    },
    loadDataKaryawan : async function () {
      try{
          if(!id)
            return;
          else {
            this.form.nip = id;
            let res = await fetch(`/api/get-karyawan/${id}`);
            let data = await res.json();
            this.form = data;
            if(data.photo != null)
              document.getElementById("labelphoto").innerHTML = data.photo.substring(1,data.photo.length);
          }
      } catch (err) {

      }
    },
    onPhotoChange: function (e) {
            try {
                let _this = this;
                let [file] = e.target.files;
                if (!file) throw Error("File kosong");
                this.form.photo = file;
                document.getElementById("labelphoto").innerHTML = this.form.photo.name;
                this.photoChanged = true;
            } catch (error) {
                console.error(error)
            }
        },
    onSave : async function() {
      try {
        //Pengecekan
        if(this.form.nip == null || this.form.nip == ""){
          toastr.warning("Harap isi NIP karyawan!");
          return;
        }
        if(this.form.id_bagian == 0){
          toastr.warning("Harap isi karyawan dari bagian mana!");
          return;
        }
        let formData = {...this.form};
        if(this.photoChanged)
          formData.photo = await this.photoUpload();
        //
        const res = await fetch('/api/update-karyawan',{
          method : 'PUT',
          body : JSON.stringify(formData),
          headers: {'Content-Type': "application/json"}
        });
        const data = await res.json();
        //
        if(data.code == 0)
          toastr.error(data.message);
        else{
          toastr.success(data.message);
          let _this = this
          setTimeout(() => {
            window.removeEventListener('beforeunload', _this.leaving, true)
            window.location = "/admin/karyawan";
          }, 1000);
        }
      } catch (err){
        console.log(err);
      }
    },
    photoUpload : async function() {
      try {
        toastr.warning("Harap Tunggu");
        let formData = new FormData();
        formData.append('file', this.form.photo)
        const params = {method: 'POST', body: formData};
        const res = await fetch('/api/upload-image', params);
        if (res.status != 200) throw Error("Upload photo gagal!");
        const data = await res.json();
        return Promise.resolve(data.path);
      } catch (err){
        return Promise.reject(err);
      }
    }
  },//endmethod
  mounted() {
    this.loadBagian()
    this.loadDataKaryawan()
  }//endMounted
})
