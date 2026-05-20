import { Controller, Get, Header } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('app')
export class FrontendController {
  @Get()
  @AllowAnonymous()
  @Header('Content-Type', 'text/html; charset=utf-8')
  render() {
    return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>BookShelf API Tester</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f7f9;
      --panel: #ffffff;
      --text: #1d2433;
      --muted: #667085;
      --line: #d9dee8;
      --brand: #2563eb;
      --brand-dark: #1d4ed8;
      --danger: #b42318;
      --ok: #067647;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 28px;
      background: var(--panel);
      border-bottom: 1px solid var(--line);
      position: sticky;
      top: 0;
      z-index: 5;
    }
    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 750;
    }
    main {
      width: min(1180px, calc(100% - 32px));
      margin: 24px auto;
      display: grid;
      grid-template-columns: 360px minmax(0, 1fr);
      gap: 20px;
    }
    section, .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
    }
    h2 {
      margin: 0 0 14px;
      font-size: 16px;
      font-weight: 720;
    }
    h3 {
      margin: 18px 0 10px;
      font-size: 14px;
    }
    label {
      display: block;
      margin: 12px 0 6px;
      font-size: 13px;
      font-weight: 650;
      color: #344054;
    }
    input, textarea, select {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 11px;
      font: inherit;
      background: #fff;
      color: var(--text);
    }
    textarea {
      min-height: 82px;
      resize: vertical;
    }
    button {
      border: 1px solid transparent;
      border-radius: 6px;
      padding: 10px 12px;
      font: inherit;
      font-weight: 700;
      background: var(--brand);
      color: #fff;
      cursor: pointer;
    }
    button:hover { background: var(--brand-dark); }
    button.secondary {
      background: #fff;
      color: #344054;
      border-color: #cbd5e1;
    }
    button.secondary:hover { background: #f8fafc; }
    button.danger {
      background: #fff;
      color: var(--danger);
      border-color: #fecdca;
    }
    .row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }
    .stack { display: grid; gap: 14px; }
    .muted { color: var(--muted); font-size: 13px; }
    .status {
      min-height: 22px;
      font-size: 13px;
      color: var(--muted);
    }
    .status.ok { color: var(--ok); }
    .status.error { color: var(--danger); }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 12px;
    }
    .club {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      background: #fff;
    }
    .club strong {
      display: block;
      margin-bottom: 6px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      height: 24px;
      padding: 0 8px;
      border-radius: 999px;
      background: #eef4ff;
      color: #3538cd;
      font-size: 12px;
      font-weight: 700;
    }
    .todo {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 14px;
      color: var(--muted);
      background: #fbfcfe;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: #111827;
      color: #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      min-height: 120px;
      font-size: 12px;
    }
    @media (max-width: 860px) {
      header { align-items: flex-start; flex-direction: column; }
      main { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>BookShelf API Tester</h1>
      <div class="muted">Interface locale pour tester les endpoints du projet.</div>
    </div>
    <div class="row">
      <span id="sessionLabel" class="pill">Non connecte</span>
      <button class="secondary" id="refreshClubs">Rafraichir</button>
    </div>
  </header>

  <main>
    <aside class="stack">
      <section>
        <h2>Auth</h2>
        <label for="name">Nom</label>
        <input id="name" value="Alice Reader" />
        <label for="email">Email</label>
        <input id="email" />
        <label for="password">Mot de passe</label>
        <input id="password" type="password" value="azertyuiop" />
        <div class="row" style="margin-top:14px">
          <button id="signUp">Inscription</button>
          <button id="signIn" class="secondary">Connexion</button>
          <button id="signOut" class="danger">Deconnexion</button>
        </div>
        <p id="authStatus" class="status"></p>
      </section>

      <section>
        <h2>Nouveau club</h2>
        <label for="clubName">Nom</label>
        <input id="clubName" value="Club des lecteurs" />
        <label for="clubDescription">Description</label>
        <textarea id="clubDescription">Lecture commune et discussions tranquilles.</textarea>
        <label for="clubVisibility">Visibilite</label>
        <select id="clubVisibility">
          <option value="true">Public</option>
          <option value="false">Prive</option>
        </select>
        <div class="row" style="margin-top:14px">
          <button id="createClub">Creer le club</button>
        </div>
        <p id="clubStatus" class="status"></p>
      </section>

      <section>
        <h2>Membres</h2>
        <p class="muted">Pour gerer un club, connecte-toi avec son OWNER ou cree un nouveau club.</p>
        <label for="selectedClub">Club selectionne</label>
        <input id="selectedClub" readonly placeholder="Aucun club selectionne" />
        <label for="inviteEmail">Email a inviter</label>
        <input id="inviteEmail" value="bob@test.com" />
        <label for="inviteRole">Role</label>
        <select id="inviteRole">
          <option value="READER">READER</option>
          <option value="EDITOR">EDITOR</option>
          <option value="OWNER">OWNER</option>
        </select>
        <div class="row" style="margin-top:14px">
          <button id="inviteMember">Inviter / ajouter</button>
          <button id="refreshMembers" class="secondary">Voir membres</button>
        </div>
        <p id="memberStatus" class="status"></p>
      </section>

      <section>
        <h2>Nouveau livre</h2>
        <label for="bookTitle">Titre</label>
        <input id="bookTitle" value="Le Petit Prince" />
        <label for="bookAuthor">Auteur</label>
        <input id="bookAuthor" value="Antoine de Saint-Exupery" />
        <label for="bookGenre">Genre</label>
        <input id="bookGenre" value="Conte" />
        <label for="bookPageCount">Nombre de pages</label>
        <input id="bookPageCount" type="number" min="1" value="120" />
        <label for="bookIsbn">ISBN</label>
        <input id="bookIsbn" placeholder="Optionnel" />
        <label for="bookDescription">Description</label>
        <textarea id="bookDescription">Un classique a lire ensemble.</textarea>
        <div class="row" style="margin-top:14px">
          <button id="createBook">Ajouter le livre</button>
        </div>
        <p id="bookStatus" class="status"></p>
      </section>

      <section>
        <h2>Progression</h2>
        <p class="muted">Selectionne un livre pour suivre ta lecture.</p>
        <label for="selectedBook">Livre selectionne</label>
        <input id="selectedBook" readonly placeholder="Aucun livre selectionne" />
        <label for="progressStatus">Statut</label>
        <select id="progressStatus">
          <option value="NOT_STARTED">NOT_STARTED</option>
          <option value="READING">READING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="ABANDONED">ABANDONED</option>
        </select>
        <label for="currentPage">Page actuelle</label>
        <input id="currentPage" type="number" min="0" value="0" />
        <label for="totalPages">Nombre total de pages</label>
        <input id="totalPages" type="number" min="1" value="120" />
        <div class="row" style="margin-top:14px">
          <button id="saveProgress">Sauver progression</button>
          <button id="refreshProgress" class="secondary">Voir global</button>
        </div>
        <p id="progressStatusText" class="status"></p>
      </section>
    </aside>

    <div class="stack">
      <section>
        <h2>Clubs publics</h2>
        <div id="clubs" class="cards"></div>
      </section>

      <section>
        <h2>Membres du club</h2>
        <div id="members" class="stack">
          <p class="muted">Aucun club selectionne.</p>
        </div>
      </section>

      <section>
        <h2>Livres du club</h2>
        <div class="row" style="margin-bottom:12px">
          <input id="filterTitle" placeholder="Filtrer par titre" />
          <input id="filterAuthor" placeholder="Auteur" />
          <input id="filterGenre" placeholder="Genre" />
          <button id="refreshBooks" class="secondary">Filtrer</button>
        </div>
        <div id="books" class="cards">
          <p class="muted">Aucun club selectionne.</p>
        </div>
      </section>

      <section>
        <h2>Progression du livre</h2>
        <div id="progressList" class="stack">
          <p class="muted">Aucun livre selectionne.</p>
        </div>
      </section>

      <section>
        <h2>Modules suivants</h2>
        <div class="stack">
          <div class="todo"><strong>Avis</strong><br />Unicite par utilisateur et note moyenne.</div>
          <div class="todo"><strong>Admin / CSV</strong><br />Gestion utilisateurs et imports transactionnels.</div>
        </div>
      </section>

      <section>
        <h2>Derniere reponse API</h2>
        <pre id="output">Pret.</pre>
      </section>
    </div>
  </main>

  <script>
    const api = location.origin;
    let currentUser = null;
    let selectedClubId = null;
    let selectedBookId = null;
    const defaultEmail = 'reader-' + Date.now() + '@test.com';

    const $ = (id) => document.getElementById(id);
    const output = $('output');
    const authStatus = $('authStatus');
    const clubStatus = $('clubStatus');
    const memberStatus = $('memberStatus');
    const bookStatus = $('bookStatus');
    const progressStatusText = $('progressStatusText');
    const sessionLabel = $('sessionLabel');
    $('email').value = defaultEmail;

    function show(data) {
      output.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    }

    function setStatus(el, message, kind = '') {
      el.textContent = message;
      el.className = 'status ' + kind;
    }

    function setUser(user) {
      currentUser = user;
      sessionLabel.textContent = user ? user.email : 'Non connecte';
    }

    function selectClub(club) {
      selectedClubId = club.id;
      selectedBookId = null;
      $('selectedClub').value = club.name + ' (' + club.id + ')';
      $('selectedBook').value = '';
      loadMembers().catch((error) => setStatus(memberStatus, error.message, 'error'));
      loadBooks().catch((error) => setStatus(bookStatus, error.message, 'error'));
      loadProgress().catch((error) => setStatus(progressStatusText, error.message, 'error'));
    }

    function selectBook(book) {
      selectedBookId = book.id;
      $('selectedBook').value = book.title + ' (' + book.id + ')';
      if (book.pageCount) {
        $('totalPages').value = book.pageCount;
      }
      setStatus(progressStatusText, 'Livre selectionne.', 'ok');
      loadProgress().catch((error) => setStatus(progressStatusText, error.message, 'error'));
    }

    async function request(path, options = {}) {
      const response = await fetch(api + path, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      });
      const text = await response.text();
      let body = text;
      try { body = text ? JSON.parse(text) : null; } catch (_) {}
      show(body);
      if (!response.ok) {
        let message = body?.message || body?.code || response.statusText;
        if (response.status === 422 && path.includes('/auth/sign-up/email')) {
          message = 'Inscription refusee: email deja utilise ou donnees invalides. Essaie Connexion ou change email.';
        }
        if (response.status === 403 && path.includes('/books')) {
          message = 'Acces refuse: seuls les membres du club peuvent voir les livres, et seuls OWNER/EDITOR peuvent les modifier.';
        }
        if (response.status === 403 && path.includes('/members')) {
          message = 'Acces refuse: seul un OWNER du club peut gerer les membres.';
        }
        if (response.status === 400 && path.includes('/members')) {
          message = body?.message || 'Action impossible: un club doit garder au moins un OWNER.';
        }
        throw new Error(Array.isArray(message) ? message.join(', ') : message);
      }
      return body;
    }

    async function loadClubs() {
      const result = await request('/clubs');
      const list = $('clubs');
      list.innerHTML = '';
      if (!result.data.length) {
        list.innerHTML = '<p class="muted">Aucun club public pour le moment.</p>';
        return;
      }
      for (const club of result.data) {
        const card = document.createElement('article');
        card.className = 'club';
        card.innerHTML = '<strong></strong><p class="muted"></p><div class="row"><span class="pill"></span><button class="secondary" type="button">Selectionner</button></div>';
        card.querySelector('strong').textContent = club.name;
        card.querySelector('p').textContent = club.description || 'Sans description';
        card.querySelector('span').textContent = club.memberCount + ' membre(s)';
        card.querySelector('button').addEventListener('click', () => selectClub(club));
        list.appendChild(card);
      }
    }

    async function loadMembers() {
      const list = $('members');
      if (!selectedClubId) {
        list.innerHTML = '<p class="muted">Aucun club selectionne.</p>';
        return;
      }
      const members = await request('/clubs/' + selectedClubId + '/members');
      list.innerHTML = '';
      if (!members.length) {
        list.innerHTML = '<p class="muted">Aucun membre.</p>';
        return;
      }
      for (const member of members) {
        const row = document.createElement('div');
        row.className = 'club';
        row.innerHTML = '<strong></strong><p class="muted"></p><div class="row"><select><option value="OWNER">OWNER</option><option value="EDITOR">EDITOR</option><option value="READER">READER</option></select><button type="button" class="secondary">Changer role</button><button type="button" class="danger">Retirer</button></div>';
        row.querySelector('strong').textContent = member.user.name || member.user.email;
        row.querySelector('p').textContent = member.user.email;
        row.querySelector('select').value = member.role;
        const buttons = row.querySelectorAll('button');
        buttons[0].addEventListener('click', async () => {
          try {
            await request('/clubs/' + selectedClubId + '/members/' + member.id, {
              method: 'PATCH',
              body: JSON.stringify({ role: row.querySelector('select').value }),
            });
            setStatus(memberStatus, 'Role mis a jour.', 'ok');
            await loadMembers();
          } catch (error) {
            setStatus(memberStatus, error.message, 'error');
          }
        });
        buttons[1].addEventListener('click', async () => {
          try {
            await request('/clubs/' + selectedClubId + '/members/' + member.id, {
              method: 'DELETE',
            });
            setStatus(memberStatus, 'Membre retire.', 'ok');
            await loadMembers();
            await loadClubs();
          } catch (error) {
            setStatus(memberStatus, error.message, 'error');
          }
        });
        list.appendChild(row);
      }
    }

    function bookQuery() {
      const params = new URLSearchParams();
      if ($('filterTitle').value.trim()) params.set('title', $('filterTitle').value.trim());
      if ($('filterAuthor').value.trim()) params.set('author', $('filterAuthor').value.trim());
      if ($('filterGenre').value.trim()) params.set('genre', $('filterGenre').value.trim());
      const query = params.toString();
      return query ? '?' + query : '';
    }

    async function loadBooks() {
      const list = $('books');
      if (!selectedClubId) {
        list.innerHTML = '<p class="muted">Aucun club selectionne.</p>';
        return;
      }
      const result = await request('/clubs/' + selectedClubId + '/books' + bookQuery());
      list.innerHTML = '';
      if (!result.data.length) {
        list.innerHTML = '<p class="muted">Aucun livre pour ce club.</p>';
        return;
      }
      for (const book of result.data) {
        const card = document.createElement('article');
        card.className = 'club';
        card.innerHTML = '<strong></strong><p class="muted"></p><div class="muted"></div><div class="row" style="margin-top:10px"><button type="button" class="secondary">Selectionner</button><button type="button" class="secondary">Renommer</button><button type="button" class="danger">Supprimer</button></div>';
        card.querySelector('strong').textContent = book.title;
        card.querySelector('p').textContent = book.author + (book.genre ? ' - ' + book.genre : '');
        card.querySelector('div.muted').textContent = (book.pageCount ? book.pageCount + ' pages - ' : '') + (book.averageRating ? 'Note moyenne ' + book.averageRating.toFixed(1) + '/5' : 'Pas encore note');
        const buttons = card.querySelectorAll('button');
        buttons[0].addEventListener('click', () => selectBook(book));
        buttons[1].addEventListener('click', async () => {
          const title = prompt('Nouveau titre', book.title);
          if (!title) return;
          try {
            await request('/clubs/' + selectedClubId + '/books/' + book.id, {
              method: 'PATCH',
              body: JSON.stringify({ title }),
            });
            setStatus(bookStatus, 'Livre mis a jour.', 'ok');
            await loadBooks();
          } catch (error) {
            setStatus(bookStatus, error.message, 'error');
          }
        });
        buttons[2].addEventListener('click', async () => {
          try {
            await request('/clubs/' + selectedClubId + '/books/' + book.id, {
              method: 'DELETE',
            });
            setStatus(bookStatus, 'Livre supprime.', 'ok');
            await loadBooks();
          } catch (error) {
            setStatus(bookStatus, error.message, 'error');
          }
        });
        list.appendChild(card);
      }
    }

    async function loadProgress() {
      const list = $('progressList');
      if (!selectedClubId || !selectedBookId) {
        list.innerHTML = '<p class="muted">Aucun livre selectionne.</p>';
        return;
      }
      const items = await request('/clubs/' + selectedClubId + '/books/' + selectedBookId + '/progress');
      list.innerHTML = '';
      if (!items.length) {
        list.innerHTML = '<p class="muted">Aucune progression pour ce livre.</p>';
        return;
      }
      for (const item of items) {
        const row = document.createElement('div');
        row.className = 'club';
        row.innerHTML = '<strong></strong><p class="muted"></p><span class="pill"></span>';
        row.querySelector('strong').textContent = item.user?.name || item.user?.email || item.userId;
        row.querySelector('p').textContent = item.currentPage + '/' + (item.totalPages || '?') + ' pages - ' + item.status;
        row.querySelector('span').textContent = item.progressPercent + '%';
        list.appendChild(row);
      }
    }

    $('signUp').addEventListener('click', async () => {
      try {
        const body = await request('/auth/sign-up/email', {
          method: 'POST',
          body: JSON.stringify({
            name: $('name').value,
            email: $('email').value,
            password: $('password').value,
          }),
        });
        setUser(body.user);
        setStatus(authStatus, 'Inscription OK.', 'ok');
      } catch (error) {
        setStatus(authStatus, error.message, 'error');
      }
    });

    $('signIn').addEventListener('click', async () => {
      try {
        const body = await request('/auth/sign-in/email', {
          method: 'POST',
          body: JSON.stringify({
            email: $('email').value,
            password: $('password').value,
            rememberMe: true,
          }),
        });
        setUser(body.user);
        setStatus(authStatus, 'Connexion OK.', 'ok');
      } catch (error) {
        setStatus(authStatus, error.message, 'error');
      }
    });

    $('signOut').addEventListener('click', async () => {
      try {
        await request('/auth/sign-out', { method: 'POST', body: '{}' });
        setUser(null);
        setStatus(authStatus, 'Deconnexion OK.', 'ok');
      } catch (error) {
        setStatus(authStatus, error.message, 'error');
      }
    });

    $('createClub').addEventListener('click', async () => {
      try {
        const body = await request('/clubs', {
          method: 'POST',
          body: JSON.stringify({
            name: $('clubName').value,
            description: $('clubDescription').value,
            isPublic: $('clubVisibility').value === 'true',
          }),
        });
        setStatus(clubStatus, 'Club cree.', 'ok');
        await loadClubs();
        selectClub(body);
        show(body);
      } catch (error) {
        setStatus(clubStatus, error.message, 'error');
      }
    });

    $('createBook').addEventListener('click', async () => {
      try {
        if (!selectedClubId) throw new Error('Selectionne un club avant ajout.');
        const pageCount = Number($('bookPageCount').value);
        const body = await request('/clubs/' + selectedClubId + '/books', {
          method: 'POST',
          body: JSON.stringify({
            title: $('bookTitle').value,
            author: $('bookAuthor').value,
            genre: $('bookGenre').value,
            pageCount: pageCount > 0 ? pageCount : undefined,
            isbn: $('bookIsbn').value,
            description: $('bookDescription').value,
          }),
        });
        setStatus(bookStatus, 'Livre ajoute.', 'ok');
        await loadBooks();
        selectBook(body);
        show(body);
      } catch (error) {
        setStatus(bookStatus, error.message, 'error');
      }
    });

    $('saveProgress').addEventListener('click', async () => {
      try {
        if (!selectedClubId || !selectedBookId) throw new Error('Selectionne un livre avant de sauver.');
        const body = await request('/clubs/' + selectedClubId + '/books/' + selectedBookId + '/progress/me', {
          method: 'PATCH',
          body: JSON.stringify({
            status: $('progressStatus').value,
            currentPage: Number($('currentPage').value),
            totalPages: Number($('totalPages').value),
          }),
        });
        setStatus(progressStatusText, 'Progression sauvegardee.', 'ok');
        await loadProgress();
        show(body);
      } catch (error) {
        setStatus(progressStatusText, error.message, 'error');
      }
    });

    $('inviteMember').addEventListener('click', async () => {
      try {
        if (!selectedClubId) throw new Error('Selectionne un club avant invitation.');
        const body = await request('/clubs/' + selectedClubId + '/members/invitations', {
          method: 'POST',
          body: JSON.stringify({
            email: $('inviteEmail').value,
            role: $('inviteRole').value,
          }),
        });
        setStatus(memberStatus, 'Invitation traitee.', 'ok');
        await loadMembers();
        await loadClubs();
        show(body);
      } catch (error) {
        setStatus(memberStatus, error.message, 'error');
      }
    });

    $('refreshMembers').addEventListener('click', () => loadMembers().catch((error) => setStatus(memberStatus, error.message, 'error')));
    $('refreshBooks').addEventListener('click', () => loadBooks().catch((error) => setStatus(bookStatus, error.message, 'error')));
    $('refreshProgress').addEventListener('click', () => loadProgress().catch((error) => setStatus(progressStatusText, error.message, 'error')));
    $('refreshClubs').addEventListener('click', () => loadClubs().catch((error) => show(error.message)));
    loadClubs().catch((error) => show(error.message));
  </script>
</body>
</html>`;
  }
}
