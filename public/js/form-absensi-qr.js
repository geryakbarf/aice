const {QRCanvas: QrCanvas} = qrcanvas.vue;
var app = new Vue({
    el: '#qr-absensi',
    data: {
        options: {
            cellSize: 10,
            correctLevel: 'H',
            data: '',
        },
    },
    methods: {
        onloadID: function () {
            if (idAbsensi != null || idAbsensi !== undefined) {
                this.options.data = idAbsensi
                console.log(idAbsensi)
            }
        }
    },
    mounted() {
        this.onloadID()
    },
    created() {
        const image = new Image();
        image.src = 'https://i.ibb.co/s6jPSPQ/output-onlinepngtools.png';
        image.onload = () => {
            this.options = Object.assign({}, this.options, {
                logo: {
                    image,
                },
            });
        };
    },
    components: {
        QrCanvas
    }
})