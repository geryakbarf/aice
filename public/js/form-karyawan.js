var app = new Vue({
    el: '#form-karyawan',
    data: {
        form: {
            nip: null,
            id_bagian: 0,
            nama: null,
            email: null,
            jabatan: 0,
            photo: null,
            id_divisi: 0
        }, //endform
        bagian: [],
        divisi: []
    }, //enddata
    methods: {
        loadBagian: async function (event) {
            try {
                let id = event.target.value
                let res = await fetch(`/api/get-bagian/${id}`);
                let data = await res.json();
                console.log(data)
                this.bagian = data;
            } catch (err) {
                console.log(err);
            }
        },
        loadDivisi: async function () {
            try {
                let res = await fetch('/api/divisi/')
                let data = await res.json()
                this.divisi = data.data
            } catch (e) {
                console.log(e)
            }
        },
        onPhotoChange: function (e) {
            try {
                let _this = this;
                let [file] = e.target.files;
                if (!file) throw Error("File kosong");
                this.form.photo = file;
                document.getElementById("labelphoto").innerHTML = this.form.photo.name;
            } catch (error) {
                console.error(error)
            }
        },
        onSave: async function () {
            try {
                //Pengecekan
                if (this.form.nip == null || this.form.nip == "") {
                    toastr.warning("Harap isi NIP karyawan!");
                    return;
                }
                if (this.form.id_bagian == 0) {
                    toastr.warning("Harap isi karyawan dari bagian mana!");
                    return;
                }
                let formData = {...this.form};
                formData.photo = await this.photoUpload();
                //
                const res = await fetch('/api/tambah-karyawan', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {'Content-Type': "application/json"}
                });
                const data = await res.json();
                //
                if (data.code == 0)
                    toastr.error(data.message);
                else {
                    toastr.success(data.message);
                    let _this = this
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        window.location = "/admin/karyawan";
                    }, 1000);
                }
            } catch (err) {
                console.log(err);
            }
        },
        photoUpload: async function () {
            try {
                toastr.warning("Harap Tunggu");
                let formData = new FormData();
                formData.append('file', this.form.photo)
                const params = {method: 'POST', body: formData};
                const res = await fetch('/api/upload-image', params);
                if (res.status != 200) throw Error("Upload photo gagal!");
                const data = await res.json();
                return Promise.resolve(data.path);
            } catch (err) {
                return Promise.reject(err);
            }
        }
    },//endmethod
    mounted() {
        this.loadDivisi()
    }//endMounted
})
