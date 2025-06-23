// Seleciona os elementos necessários
const sidebarToggleBtn = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const content = document.querySelector('main.content'); // Conteúdo principal
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = themeToggleBtn.querySelector('span.material-icons');
const root = document.documentElement;
const sitePresentation = document.getElementById('site-presentation');
const realContent = document.getElementById('real-content');
const sidebarLinks = document.querySelectorAll('aside.sidebar nav a');


// Função para ajustar a margem do conteúdo dependendo do estado da sidebar
function adjustContentMargin() {
  if (sidebar.classList.contains('active')) {
    // Se a sidebar estiver visível, empurra o conteúdo para a direita
    content.style.marginLeft = `${sidebar.offsetWidth}px`;
  } else {
    // Se a sidebar não estiver visível, o conteúdo deve estar centralizado
    content.style.marginLeft = '0';
  }
}

// Função para alternar o tema (modo claro e escuro)
function setTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeToggleBtn.setAttribute('aria-label', 'Ativar modo claro');
    themeToggleBtn.setAttribute('aria-pressed', 'true');
    themeToggleIcon.textContent = 'dark_mode';
  } else {
    root.setAttribute('data-theme', 'light');
    themeToggleBtn.setAttribute('aria-label', 'Ativar modo escuro');
    themeToggleBtn.setAttribute('aria-pressed', 'false');
    themeToggleIcon.textContent = 'light_mode';
  }
  localStorage.setItem('theme', theme);
}

// Inicializa o tema da página (verifica se existe um tema salvo ou usa o preferido pelo sistema)
(function () {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
})();

// Evento para alternar o tema ao clicar no botão
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = root.getAttribute('data-theme') || 'light';
  if (currentTheme === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
});

// Evento para alternar a visibilidade da sidebar ao clicar no botão
sidebarToggleBtn.addEventListener('click', () => {
  const expanded = sidebarToggleBtn.getAttribute('aria-expanded') === 'true';
  sidebarToggleBtn.setAttribute('aria-expanded', String(!expanded));
  sidebar.classList.toggle('active');

  // ✅ Aplica ou remove a classe no <body>
if (!expanded) {
  document.body.classList.add('sidebar-visible');
} else {
  document.body.classList.remove('sidebar-visible');
}


  adjustContentMargin();

  if (!expanded) {
    sidebar.setAttribute('aria-hidden', 'false');
    const firstLink = sidebar.querySelector('a');
    if (firstLink) firstLink.focus();
  } else {
    sidebar.setAttribute('aria-hidden', 'true');
    sidebarToggleBtn.focus();
  }
});


// Ajusta a margem do conteúdo ao carregar a página, caso a sidebar já esteja aberta
window.addEventListener('load', adjustContentMargin);
if (sidebar.classList.contains('active')) {
  document.body.classList.add('sidebar-visible');
}


// Fecha a sidebar ao clicar nos links da sidebar (em telas menores)
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 1024) {
      sidebar.classList.remove('active');
      sidebarToggleBtn.setAttribute('aria-expanded', 'false');
      sidebar.setAttribute('aria-hidden', 'true');
      
      // Ajusta a margem do conteúdo após a sidebar ser fechada
      adjustContentMargin();
    }
  });
});

// Função para alternar entre as seções do conteúdo
document.querySelectorAll('nav.desktop-nav a, aside.sidebar nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove a classe 'active' de todas as seções
    document.querySelectorAll('section.topic-section').forEach(section => {
      section.classList.remove('active');
    });

    // Encontra o tópico correspondente ao link clicado
    const targetSection = document.querySelector(e.target.getAttribute('href'));
    if (targetSection) {
      targetSection.classList.add('active'); // Exibe o conteúdo da seção
    }
  });
});

// Seleção dos links da sidebar para exibir o conteúdo real
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Exibe o conteúdo real e oculta a introdução
    sitePresentation.style.opacity = 0;
    sitePresentation.style.visibility = 'hidden';
    sitePresentation.style.pointerEvents = 'none'; // Impede a interação com a introdução

    realContent.style.display = 'block'; // Exibe o conteúdo real
  });
});

// Ativa a navegação no teclado dentro da sidebar (acessibilidade)
sidebar.addEventListener('keydown', e => {
  if (!sidebar.classList.contains('active')) return;

  const focusableEls = [...sidebar.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')];
  if (focusableEls.length === 0) return;

  const first = focusableEls[0];
  const last = focusableEls[focusableEls.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else { // Tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
});

// Atalho de teclado para alternar a sidebar (Ctrl + M)
document.addEventListener('keydown', e => {
  if (e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
    e.preventDefault();
    sidebarToggleBtn.click();
  }
});
