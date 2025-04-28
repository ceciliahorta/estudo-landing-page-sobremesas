const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const items = document.querySelectorAll(".item");
const dots = document.querySelectorAll('.dot');
const container = document.querySelector('.container');
const productsContainer = document.querySelector(".products_container");

let active = 0;
const total = items.length;
let autoSlide;

const backgrounds = [
  {
    bg: "#f8d49d",
    glow: "rgba(255, 237, 200, 0.6)",
    btnBg: "#ff7b00",
    btnText: "#fff"
  },
  {
    bg: "#3e2c2b",
    glow: "rgba(94, 70, 65, 0.6)",
    btnBg: "#fff",
    btnText: "#3e2c2b"
  },
  {
    bg: "#4a1c3c",
    glow: "rgba(94, 24, 74, 0.5)",
    btnBg: "#ff69b4",
    btnText: "#fff"
  }
];

function update(direction) {
  items[active].classList.remove('active');
  dots[active].classList.remove('active');

  if (direction > 0) {
    active = (active + 1) % total;
  } else {
    active = (active - 1 + total) % total;
  }

  items[active].classList.add('active');
  dots[active].classList.add('active');

  const currentStyle = backgrounds[active];
  container.style.backgroundColor = currentStyle.bg;
  document.documentElement.style.setProperty('--glow-color', currentStyle.glow);

  const activeBtn = items[active].querySelector(".btn");
  activeBtn.style.backgroundColor = currentStyle.btnBg;
  activeBtn.style.color = currentStyle.btnText;
}

function applyInitialStyles() {
  const initialStyle = backgrounds[active];
  container.style.backgroundColor = initialStyle.bg;
  document.documentElement.style.setProperty('--glow-color', initialStyle.glow);

  items[active].classList.add('active');
  dots[active].classList.add('active');

  const activeBtn = items[active].querySelector(".btn");
  activeBtn.style.backgroundColor = initialStyle.btnBg;
  activeBtn.style.color = initialStyle.btnText;
}

function startAutoSlide() {
  autoSlide = setInterval(() => {
    update(1);
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

prevBtn.addEventListener("click", () => {
  update(-1);
  resetAutoSlide();
});

nextBtn.addEventListener("click", () => {
  update(1);
  resetAutoSlide();
});

window.addEventListener('DOMContentLoaded', () => {
  applyInitialStyles();
  startAutoSlide();
  productsByCategorya();
});

/* Área dos produtos */

async function productsByCategorya() {
  try {
    const response = await fetch('products.json');
    const data = await response.json();
    const produtos = data.produtos;

    const byCategory = produtos.reduce((acc, produto) => {
      if (!acc[produto.categoria]) {
        acc[produto.categoria] = [];
      }
      acc[produto.categoria].push(produto);
      return acc;
    }, {});

    productsContainer.innerHTML = '';

    for (const categoria in byCategory) {
      if (byCategory.hasOwnProperty(categoria)) {
        const categoriaTitulo = document.createElement('h2');
        categoriaTitulo.textContent = categoria;
        productsContainer.appendChild(categoriaTitulo);

        const cardsContainer = document.createElement('div');
        cardsContainer.classList.add("cards_container")

        byCategory[categoria].forEach(produto => {
          const card = document.createElement('div');
          card.classList.add('card');

          const imgContainer = document.createElement('div');
          imgContainer.classList.add('card-image')
          const img = document.createElement('img');
          img.src = `./img/${produto.imagem}`;
          img.alt = produto.nome;
          imgContainer.appendChild(img);

          const infoContainer = document.createElement('card-info');

          const h3 = document.createElement('h3');
          h3.textContent = produto.nome;

          const p = document.createElement('p');
          p.textContent = produto.descricao;

          const preco = document.createElement('p');
          preco.classList.add('product-price');
          preco.textContent = `Preço: R$ ${produto.preco}`;

          const button = document.createElement('button');
          button.classList.add('btn');
          button.textContent = 'Saiba Mais'

          infoContainer.appendChild(h3);
          infoContainer.appendChild(p);
          infoContainer.appendChild(preco);
          infoContainer.appendChild(button);

          card.appendChild(imgContainer);
          card.appendChild(infoContainer);

          cardsContainer.appendChild(card);
        });

        productsContainer.appendChild(cardsContainer);
      }
    }
  } catch (error) {
    productsContainer.innerHTML = '<p>Erro ao carregar produtos.</p>'
  }
}