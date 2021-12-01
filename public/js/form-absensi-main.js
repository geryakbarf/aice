var app = new Vue({
    el: '#main-absensi',
    data: {},
    methods: {
        addMainAbsensi: async function () {
            try {
                let json = {
                    today: this.formatDate()
                }
                const res = await fetch('/api/main-absensi', {
                    method: 'POST',
                    body: JSON.stringify(json),
                    headers: {'Content-Type': "application/json"}
                });
                const data = await res.json()
                if (data.code > 0) {
                    toastr.success(data.message)
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', this.leaving, true)
                        window.location = "/admin/absensi/"
                    }, 1000)
                } else
                    toastr.error(data.message)
            } catch (e) {
                console.log(e)
            }
        },
        formatDate: function () {
            let d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }
    },
    mounted() {
    }
})