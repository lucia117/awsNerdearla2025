class CarbonCalculator {
    constructor() {
        this.form = document.getElementById('carbonForm');
        this.results = document.getElementById('results');
        this.recalculateBtn = document.getElementById('recalculate');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.recalculateBtn.addEventListener('click', () => this.showForm());
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const data = {
            carKm: parseFloat(document.getElementById('carKm').value),
            flights: parseFloat(document.getElementById('flights').value),
            electricity: parseFloat(document.getElementById('electricity').value),
            heating: document.getElementById('heating').value,
            meat: parseFloat(document.getElementById('meat').value)
        };

        const carbonFootprint = this.calculateCarbon(data);
        this.displayResults(carbonFootprint);
    }

    calculateCarbon(data) {
        // Factores de emisión (kg CO2 por unidad)
        const factors = {
            carKmPerWeek: 0.2, // kg CO2 por km
            flightPerYear: 1000, // kg CO2 por vuelo promedio
            electricityPerMonth: 0.5, // kg CO2 por kWh
            heating: {
                gas: 200, // kg CO2 por mes
                electric: 150,
                renewable: 50
            },
            meatPerWeek: 15 // kg CO2 por comida con carne
        };

        // Cálculos anuales
        const transport = (data.carKm * 52 * factors.carKmPerWeek) + (data.flights * factors.flightPerYear);
        const home = (data.electricity * 12 * factors.electricityPerMonth) + (factors.heating[data.heating] * 12);
        const food = data.meat * 52 * factors.meatPerWeek;

        return {
            transport: transport / 1000, // convertir a toneladas
            home: home / 1000,
            food: food / 1000,
            total: (transport + home + food) / 1000
        };
    }

    displayResults(carbon) {
        // Actualizar números
        document.getElementById('totalCarbon').textContent = carbon.total.toFixed(1);
        document.getElementById('transport-carbon').textContent = `${carbon.transport.toFixed(1)} ton`;
        document.getElementById('home-carbon').textContent = `${carbon.home.toFixed(1)} ton`;
        document.getElementById('food-carbon').textContent = `${carbon.food.toFixed(1)} ton`;

        // Comparación con promedio mundial (4.8 ton per capita)
        const worldAverage = 4.8;
        const comparison = document.getElementById('comparison-text');
        
        if (carbon.total > worldAverage) {
            comparison.textContent = `${(carbon.total / worldAverage * 100 - 100).toFixed(0)}% por encima del promedio mundial`;
            comparison.style.color = '#ff6b6b';
        } else {
            comparison.textContent = `${(100 - carbon.total / worldAverage * 100).toFixed(0)}% por debajo del promedio mundial`;
            comparison.style.color = '#51cf66';
        }

        // Generar tips personalizados
        this.generateTips(carbon);

        // Mostrar resultados con animación
        this.form.style.display = 'none';
        this.results.classList.remove('hidden');
        this.results.scrollIntoView({ behavior: 'smooth' });
    }

    generateTips(carbon) {
        const tipsList = document.getElementById('tips-list');
        const tips = [];

        if (carbon.transport > 2) {
            tips.push('Considera usar transporte público o bicicleta para trayectos cortos');
            tips.push('Planifica menos vuelos o compensa las emisiones');
        }

        if (carbon.home > 1.5) {
            tips.push('Cambia a bombillas LED y electrodomésticos eficientes');
            tips.push('Mejora el aislamiento de tu hogar');
        }

        if (carbon.food > 1) {
            tips.push('Reduce el consumo de carne 2-3 días por semana');
            tips.push('Compra productos locales y de temporada');
        }

        // Tips generales
        tips.push('Usa energías renovables si es posible');
        tips.push('Recicla y reduce el consumo de plásticos');
        tips.push('Planta árboles o apoya proyectos de reforestación');

        tipsList.innerHTML = tips.slice(0, 5).map(tip => `<li>${tip}</li>`).join('');
    }

    showForm() {
        this.results.classList.add('hidden');
        this.form.style.display = 'block';
        this.form.scrollIntoView({ behavior: 'smooth' });
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new CarbonCalculator();
    
    // Pequeña animación de entrada
    document.querySelector('.hero-content').style.opacity = '0';
    document.querySelector('.hero-content').style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.querySelector('.hero-content').style.transition = 'all 0.6s ease';
        document.querySelector('.hero-content').style.opacity = '1';
        document.querySelector('.hero-content').style.transform = 'translateY(0)';
    }, 100);
});