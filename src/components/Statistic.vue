<template>
<div>
    <div class="row d-flex px-4 flex-wrap justify-content-between my-2 g-2">
        <div class="
          d-flex
          my-2
          justify-content-between
          col-md-12
          bg-white
          rounded
          shadow-lg
        ">
            <div class="rounded-lg p-2 col-md-3 bg-white">
                <div class="card-body">
                    <div class="pt-2 text-center">
                        <h6 class="text-center h6">Montant reçu cette semaine</h6>
                    </div>

                    <div class="row">
                        <canvas id="myChart" width="300" height="280"> </canvas>
                    </div>
                </div>
            </div>
            <div class="rounded-lg p-2 col-md-3 bg-white">
                <div class="card-body">
                    <div class="pt-2 text-center">
                        <h5 class="text-center h6">Montant depensé cette semaine</h5>
                    </div>

                    <div class="row">
                        <canvas id="myDonhut" width="300" height="280"> </canvas>
                    </div>
                </div>
            </div>
            <div class="rounded-lg p-2 col-md-3 bg-white">
                <div class="card-body">
                    <div class="pt-2 text-centercol-md-8">
                        <h5 class="text-center h6">Bénéfice attente pour cette semaine </h5>
                    </div>

                    <div class="row">
                        <canvas id="myPie" width="300" height="280"> </canvas>
                    </div>
                </div>
            </div>
            <div class="rounded-lg p-2 col-md-3 bg-white">
                <div class="card-body">
                    <div class="pt-2 text-centercol-md-8">
                        <h5 class="text-center h6">Bénéfice perçu cette semaine</h5>
                    </div>

                    <div class="row">
                        <canvas id="myPie2" width="300" height="280"> </canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
// import {Chart, BarElement, BarController,DoughnutController, PieController,} from 'chart.js'
// Chart.register(BarElement, BarController,DoughnutController, PieController,)
import Chart from "chart.js/auto";
const ListsMixin = require("../mixins/lists").default;

export default {
    name: "Statistics",
    data: function () {
        return {
            // reception
            recepLundi: 0,
            recepMardi: 0,
            recepMercredi: 0,
            recepJeudi: 0,
            recepVendredi: 0,
            recepSamedi: 0,
            // depense
            depLundi: 0,
            depMardi: 0,
            depMercredi: 0,
            depJeudi: 0,
            depVendredi: 0,
            depSamedi: 0,
            // benefice percu
            BPLundi: 0,
            BPMardi: 0,
            BPMercredi: 0,
            BPJeudi: 0,
            BPVendredi: 0,
            BPSamedi: 0,

            // benefice attente
            BALundi: 0,
            BAMardi: 0,
            BAMercredi: 0,
            BAJeudi: 0,
            BAVendredi: 0,
            BASamedi: 0,

            totalSemaine: 0,
        };
    },
    mixins: [ListsMixin],
    created() {
        this.getReceptionList();
        this.getDepenseList();
    },
    computed: {

        receptionSemaine() {
            let recepSem = [];
            this.receptions.forEach(function (el) {
                if (el.date.getWeek() == new Date().getWeek()) {
                    el.jour = el.date.getDay();
                    recepSem.push(el);
                }
            });
            return recepSem;
        },
        depenseSemaine() {
            let depSem = [];
            this.depenses.forEach(function (el) {
                console.log(el.date.getWeek(), el.date);
                if (el.date.getWeek() == new Date().getWeek()) {
                    el.jour = el.date.getDay();

                    depSem.push(el);
                }
            });
            console.log(depSem);
            return depSem;
        },
        beneficePeSemaine() {
            let chgtSem = [];
            this.chargements.forEach(function (el) {
                if ((el.updatedAt.getWeek() == new Date().getWeek()) && (el.status == "livré")) {
                    el.jour = el.updatedAt.getDay();
                    console.log('updated: ', el.updatedAt.getDay());

                    chgtSem.push(el);
                }
            });
            console.log(chgtSem);
            return chgtSem;
        },
        beneficeAtSemaine() {
            let chgtSem = [];
            this.chargements.forEach(function (el) {
                console.log(el.date.getWeek(), el.date);
                if ((el.date.getWeek() == new Date().getWeek()) && (el.status == "attente")) {
                    el.jour = el.date.getDay();

                    chgtSem.push(el);
                }
            });
            console.log(chgtSem);
            return chgtSem;
        },
    },

    mounted: function () {
        this.getChargementList()
        setTimeout(() => {
            this.semaine();
            this.loadStatistics();
            this.mainStat()

        }, 500);
    },
    methods: {
        mainStat() {
            let solde = 0
            let benefice_attente = 0
            let benefice_percu = 0
            let totalReception = 0
            let totalDepense = 0

            this.receptions.forEach((el) => {
                totalReception += el.montant
            })
            this.depenses.forEach((el) => {
                totalDepense += el.montant
            })
            this.chargements.forEach((el) => {
                if (el.status == 'attente') {
                    benefice_attente += el.benefice

                } else if (el.status == 'livré') {
                    benefice_percu += el.benefice
                }
            })
            solde = totalReception - totalDepense

            this.$store.commit('affecter', {
                somme: solde,
                etat: 'principal'
            })
            this.$store.commit('affecter', {
                somme: totalReception,
                etat: 'recu'
            })
            this.$store.commit('affecter', {
                somme: totalDepense,
                etat: 'depense'
            })
            this.$store.commit('affecter', {
                somme: benefice_percu,
                etat: 'percu'
            })
            this.$store.commit('affecter', {
                somme: benefice_attente,
                etat: 'attente'
            })

        },
        semaine() {
            this.totalSemaine = 0;
            for (let i = 0; i < this.receptionSemaine.length; i++) {
                this.totalSemaine += this.receptionSemaine[i].montant;
                if (this.receptionSemaine[i].jour == 1) {
                    this.recepLundi = this.receptionSemaine[i].montant;
                } else if (this.receptionSemaine[i].jour == 2) {
                    this.recepMardi += this.receptionSemaine[i].montant;
                } else if (this.receptionSemaine[i].jour == 3) {
                    this.recepMercredi += this.receptionSemaine[i].montant;
                } else if (this.receptionSemaine[i].jour == 4) {
                    this.recepJeudi += this.receptionSemaine[i].montant;
                } else if (this.receptionSemaine[i].jour == 5) {
                    this.recepVendredi += this.receptionSemaine[i].montant;
                } else if (this.receptionSemaine[i].jour == 6) {
                    this.recepSamedi += this.receptionSemaine[i].montant;
                }
            }
            for (let i = 0; i < this.depenseSemaine.length; i++) {
                this.totalSemaine += this.depenseSemaine[i].montant;
                if (this.depenseSemaine[i].jour == 1) {
                    this.depLundi = this.depenseSemaine[i].montant;
                } else if (this.depenseSemaine[i].jour == 2) {
                    this.depMardi += this.depenseSemaine[i].montant;
                } else if (this.depenseSemaine[i].jour == 3) {
                    this.depMercredi += this.depenseSemaine[i].montant;
                } else if (this.depenseSemaine[i].jour == 4) {
                    this.depJeudi += this.depenseSemaine[i].montant;
                } else if (this.depenseSemaine[i].jour == 5) {
                    this.depVendredi += this.depenseSemaine[i].montant;
                } else if (this.depenseSemaine[i].jour == 6) {
                    this.depSamedi += this.depenseSemaine[i].montant;
                }
            }
            for (let i = 0; i < this.beneficePeSemaine.length; i++) {
                this.totalSemaine += this.beneficePeSemaine[i].benefice;
                if (this.beneficePeSemaine[i].jour == 1) {
                    this.BPLundi = this.beneficePeSemaine[i].benefice;
                } else if (this.beneficePeSemaine[i].jour == 2) {
                    this.BPMardi += this.beneficePeSemaine[i].benefice;
                } else if (this.beneficePeSemaine[i].jour == 3) {
                    this.BPMercredi += this.beneficePeSemaine[i].benefice;
                } else if (this.beneficePeSemaine[i].jour == 4) {
                    this.BPJeudi += this.beneficePeSemaine[i].benefice;
                } else if (this.beneficePeSemaine[i].jour == 5) {
                    this.BPVendredi += this.beneficePeSemaine[i].benefice;
                } else if (this.beneficePeSemaine[i].jour == 6) {
                    this.BPSamedi += this.beneficePeSemaine[i].benefice;
                }
            }

            for (let i = 0; i < this.beneficeAtSemaine.length; i++) {
                this.totalSemaine += this.beneficeAtSemaine[i].benefice;
                if (this.beneficeAtSemaine[i].jour == 1) {
                    this.BALundi = this.beneficeAtSemaine[i].benefice;
                } else if (this.beneficeAtSemaine[i].jour == 2) {
                    this.BAMardi += this.beneficeAtSemaine[i].benefice;
                } else if (this.beneficeAtSemaine[i].jour == 3) {
                    this.BAMercredi += this.beneficeAtSemaine[i].benefice;
                } else if (this.beneficeAtSemaine[i].jour == 4) {
                    this.BAJeudi += this.beneficeAtSemaine[i].benefice;
                } else if (this.beneficeAtSemaine[i].jour == 5) {
                    this.BAVendredi += this.beneficeAtSemaine[i].benefice;
                } else if (this.beneficeAtSemaine[i].jour == 6) {
                    this.BASamedi += this.beneficeAtSemaine[i].benefice;
                }
            }
            console.log(this.recepLundi, this.receptionSemaine);
            console.log(this.totalSemaine);
        },
        loadStatistics() {
            let labels = [
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi"
            ]
            let data = {
                labels: labels,
                datasets: [{
                    barThickness: 10,
                    label: "Somme Reçue ",
                    data: [
                        this.recepLundi,
                        this.recepMardi,
                        this.recepMercredi,
                        this.recepJeudi,
                        this.recepVendredi,
                        3,
                        1,
                    ],
                    backgroundColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 0.8)",
                        "rgba(255, 159, 64, 0.8)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                    lineWidth: 1,
                }, ],
            };
            var ctx = document.getElementById("myChart").getContext("2d");

            new Chart(ctx, {
                type: "pie",
                data: data,
                options: {
                    cutout: "10%",

                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                        },
                        title: {
                            display: true,
                        },
                    },
                },
            });

            var don = document.getElementById("myDonhut").getContext("2d");
            new Chart(don, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Somme depensée",
                        barThickness: 10,
                        data: [
                            this.depLundi,
                            this.depMardi,
                            this.depMercredi,
                            this.depJeudi,
                            this.depVendredi,
                            this.depSamedi,
                        ],
                        backgroundColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        // borderRadius: 30,
                        borderWidth: 1,
                    }, ],
                },
                options: {
                    cutout: "10%",
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                        },
                        title: {
                            display: true,
                        },
                    },
                },
            });

            var pie = "myPie";
            new Chart(pie, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Bénéfice en attente",
                        data: [this.BALundi, this.BAMardi, this.BAMercredi, this.BAJeudi, this.BAVendredi, this.BASamedi],

                        backgroundColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(9, 129, 74, 1)",

                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(9, 129, 74, 1)",

                        ],
                        borderWidth: 1,
                    }, ],
                },
                options: {
                    cutout: "10%",
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                        },
                        title: {
                            display: true,
                        },
                    },
                },
            });

            var pie2 = document.getElementById("myPie2").getContext("2d");
            new Chart(pie2, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Bénéfice perçu",
                        data: [this.BPLundi, this.BPMardi, this.BPMercredi, this.BPJeudi, this.BPVendredi,this.BPSamedi],
                        backgroundColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(9, 129, 74, 1)",

                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(9, 129, 74, 1)",

                        ],
                        borderWidth: 1,
                    }, ],
                },
                options: {
                    cutout: "10%",
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom",
                        },
                        title: {
                            display: true,
                            // text: "Les chambres les plus utilisés aujourd'hui"
                        },
                    },
                },
            });
        },
    },
};
</script>
