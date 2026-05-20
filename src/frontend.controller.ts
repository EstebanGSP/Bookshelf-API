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
  <title>BookShelf</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f6f8;
      --panel: #ffffff;
      --panel-soft: #f8fafc;
      --text: #182230;
      --muted: #667085;
      --line: #d7dde7;
      --brand: #2563eb;
      --brand-dark: #1d4ed8;
      --danger: #b42318;
      --ok: #067647;
      --warn: #b54708;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    header {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 24px;
      background: var(--panel);
      border-bottom: 1px solid var(--line);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    h1, h2, h3 { margin: 0; }
    h1 { font-size: 20px; font-weight: 800; }
    h2 { font-size: 17px; font-weight: 760; }
    h3 { font-size: 14px; font-weight: 740; }
    main {
      width: min(1280px, calc(100% - 32px));
      margin: 20px auto 40px;
      display: grid;
      gap: 16px;
    }
    .shell {
      display: grid;
      grid-template-columns: 320px minmax(0, 1fr);
      gap: 16px;
      align-items: start;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
    }
    .soft {
      background: var(--panel-soft);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
    }
    .stack { display: grid; gap: 12px; }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    label {
      display: block;
      margin: 10px 0 5px;
      color: #344054;
      font-size: 13px;
      font-weight: 680;
    }
    input, textarea, select {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 9px 10px;
      background: #ffffff;
      color: var(--text);
      font: inherit;
    }
    textarea {
      min-height: 76px;
      resize: vertical;
    }
    button {
      border: 1px solid transparent;
      border-radius: 6px;
      padding: 9px 11px;
      background: var(--brand);
      color: #ffffff;
      font: inherit;
      font-weight: 740;
      cursor: pointer;
    }
    button:hover { background: var(--brand-dark); }
    button.secondary {
      background: #ffffff;
      color: #344054;
      border-color: #cbd5e1;
    }
    button.secondary:hover { background: #f8fafc; }
    button.danger {
      background: #ffffff;
      color: var(--danger);
      border-color: #fda29b;
    }
    button:disabled {
      cursor: not-allowed;
      opacity: .55;
    }
    .muted { color: var(--muted); font-size: 13px; }
    .hidden { display: none !important; }
    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 0 8px;
      border-radius: 999px;
      background: #eef4ff;
      color: #3538cd;
      font-size: 12px;
      font-weight: 780;
    }
    .pill.ok { background: #ecfdf3; color: var(--ok); }
    .pill.warn { background: #fffaeb; color: var(--warn); }
    .status {
      min-height: 20px;
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 13px;
    }
    .status.ok { color: var(--ok); }
    .status.error { color: var(--danger); }
    .list {
      display: grid;
      gap: 8px;
      max-height: 390px;
      overflow: auto;
    }
    .item {
      display: grid;
      gap: 7px;
      padding: 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #ffffff;
    }
    .item.selected {
      border-color: #84adff;
      box-shadow: 0 0 0 2px #d1e0ff;
    }
    .tabs {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 10px;
    }
    .tab {
      background: #ffffff;
      color: #344054;
      border: 1px solid #cbd5e1;
    }
    .tab.active {
      background: var(--brand);
      color: #ffffff;
      border-color: var(--brand);
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: #111827;
      color: #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      min-height: 110px;
      font-size: 12px;
    }
    @media (max-width: 920px) {
      header { height: auto; align-items: flex-start; flex-direction: column; padding: 14px 16px; }
      .shell, .grid-2, .grid-3 { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>BookShelf</h1>
      <div class="muted">Interface de test claire pour l'API de clubs de lecture.</div>
    </div>
    <div class="row">
      <span id="sessionBadge" class="pill warn">Non connecte</span>
      <button id="adminModeBtn" class="secondary hidden">Mode admin</button>
      <button id="logoutBtn" class="secondary hidden">Deconnexion</button>
    </div>
  </header>

  <main>
    <section id="authView" class="shell">
      <div class="panel stack">
        <div>
          <h2>Connexion</h2>
          <p class="muted">Connecte-toi pour gerer tes clubs, livres et progressions.</p>
        </div>
        <label for="authName">Nom</label>
        <input id="authName" value="Nouveau lecteur" />
        <label for="authEmail">Email</label>
        <input id="authEmail" />
        <label for="authPassword">Mot de passe</label>
        <input id="authPassword" type="password" value="azertyuiop" />
        <div class="row">
          <button id="loginBtn">Connexion</button>
          <button id="registerBtn" class="secondary">Inscription</button>
        </div>
        <p id="authMsg" class="status"></p>
      </div>

      <div class="panel stack">
        <div>
          <h2>Clubs publics</h2>
          <p class="muted">Connecte-toi pour rejoindre le contexte de test et gerer les ressources autorisees.</p>
        </div>
        <div id="publicClubList" class="list"></div>
      </div>
    </section>

    <section id="appView" class="hidden shell">
      <aside class="stack">
        <div class="panel stack">
          <div class="row" style="justify-content:space-between">
            <h2>Clubs</h2>
            <button id="reloadClubsBtn" class="secondary">Rafraichir</button>
          </div>
          <div id="clubList" class="list"></div>
        </div>

        <div class="panel stack">
          <h2>Nouveau club</h2>
          <label for="newClubName">Nom</label>
          <input id="newClubName" value="Club des lecteurs" />
          <label for="newClubDescription">Description</label>
          <textarea id="newClubDescription">Lecture commune et discussions.</textarea>
          <label for="newClubPublic">Visibilite</label>
          <select id="newClubPublic">
            <option value="true">Public</option>
            <option value="false">Prive</option>
          </select>
          <button id="createClubBtn">Creer le club</button>
          <p id="clubCreateMsg" class="status"></p>
        </div>
      </aside>

      <div class="stack">
        <div id="emptyState" class="panel">
          <h2>Aucun club selectionne</h2>
          <p class="muted">Selectionne un club public ou cree ton club pour tester les fonctionnalites.</p>
        </div>

        <div id="clubWorkspace" class="hidden stack">
          <div class="panel stack">
            <div class="row" style="justify-content:space-between">
              <div>
                <h2 id="selectedClubName">Club</h2>
                <div id="selectedClubMeta" class="muted"></div>
              </div>
              <span id="clubRoleBadge" class="pill warn">Role inconnu</span>
            </div>
            <div id="permissionHint" class="soft muted"></div>
          </div>

          <div class="panel stack">
            <div class="tabs">
              <button class="tab active" data-tab="overview">Club</button>
              <button class="tab" data-tab="members">Membres</button>
              <button class="tab" data-tab="books">Livres</button>
              <button class="tab" data-tab="progress">Progression</button>
              <button class="tab" data-tab="reviews">Avis</button>
            </div>

            <section id="tab-overview" class="tabPanel stack">
              <div class="grid-2">
                <div class="soft stack">
                  <h3>Modifier le club</h3>
                  <label for="editClubName">Nom</label>
                  <input id="editClubName" />
                  <label for="editClubDescription">Description</label>
                  <textarea id="editClubDescription"></textarea>
                  <label for="editClubPublic">Visibilite</label>
                  <select id="editClubPublic">
                    <option value="true">Public</option>
                    <option value="false">Prive</option>
                  </select>
                  <div class="row">
                    <button id="updateClubBtn">Enregistrer</button>
                    <button id="deleteClubBtn" class="danger">Supprimer</button>
                  </div>
                  <p id="clubEditMsg" class="status"></p>
                </div>
                <div class="soft stack">
                  <h3>Etat des droits</h3>
                  <div id="rightsSummary" class="muted"></div>
                </div>
              </div>
            </section>

            <section id="tab-members" class="tabPanel hidden stack">
              <div class="grid-2">
                <div class="soft stack">
                  <h3>Inviter / ajouter un membre</h3>
                  <label for="inviteEmail">Email</label>
                  <input id="inviteEmail" value="reader@test.com" />
                  <label for="inviteRole">Role</label>
                  <select id="inviteRole">
                    <option value="READER">READER</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="OWNER">OWNER</option>
                  </select>
                  <button id="inviteBtn">Inviter</button>
                  <p id="memberMsg" class="status"></p>
                </div>
                <div class="soft stack">
                  <h3>Membres du club</h3>
                  <div id="memberList" class="list"></div>
                </div>
              </div>
              <div class="soft stack">
                <h3>Import CSV de membres</h3>
                <p class="muted">Colonnes attendues: email,role. Roles possibles: OWNER, EDITOR, READER.</p>
                <textarea id="memberCsv" style="min-height:130px">email,role
reader-csv@test.com,READER
editor-csv@test.com,EDITOR</textarea>
                <button id="importMembersBtn">Importer les membres</button>
                <p id="memberImportMsg" class="status"></p>
                <pre id="memberImportOutput">Aucun import.</pre>
              </div>
            </section>

            <section id="tab-books" class="tabPanel hidden stack">
              <div class="grid-2">
                <div class="soft stack">
                  <h3 id="bookFormTitle">Ajouter un livre</h3>
                  <label for="bookTitle">Titre</label>
                  <input id="bookTitle" value="Le Petit Prince" />
                  <label for="bookAuthor">Auteur</label>
                  <input id="bookAuthor" value="Antoine de Saint-Exupery" />
                  <label for="bookGenre">Genre</label>
                  <input id="bookGenre" value="Conte" />
                  <label for="bookPageCount">Pages</label>
                  <input id="bookPageCount" type="number" min="1" value="120" />
                  <label for="bookIsbn">ISBN</label>
                  <input id="bookIsbn" />
                  <label for="bookDescription">Description</label>
                  <textarea id="bookDescription">Un classique a lire ensemble.</textarea>
                  <div class="row">
                    <button id="createBookBtn">Ajouter</button>
                    <button id="updateBookBtn" class="secondary">Modifier la selection</button>
                    <button id="clearBookBtn" class="secondary">Vider</button>
                  </div>
                  <p id="bookMsg" class="status"></p>
                </div>
                <div class="soft stack">
                  <div class="row" style="justify-content:space-between">
                    <h3>Livres du club</h3>
                    <button id="reloadBooksBtn" class="secondary">Rafraichir</button>
                  </div>
                  <div class="grid-3">
                    <input id="filterTitle" placeholder="Titre" />
                    <input id="filterAuthor" placeholder="Auteur" />
                    <input id="filterGenre" placeholder="Genre" />
                  </div>
                  <button id="filterBooksBtn" class="secondary">Filtrer</button>
                  <div id="bookList" class="list"></div>
                </div>
              </div>
            </section>

            <section id="tab-progress" class="tabPanel hidden stack">
              <div class="grid-2">
                <div class="soft stack">
                  <h3>Ma progression</h3>
                  <div id="selectedBookLabel" class="muted">Aucun livre selectionne.</div>
                  <label for="progressStatus">Statut</label>
                  <select id="progressStatus">
                    <option value="NOT_STARTED">NOT_STARTED</option>
                    <option value="READING">READING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ABANDONED">ABANDONED</option>
                  </select>
                  <label for="currentPage">Page actuelle</label>
                  <input id="currentPage" type="number" min="0" value="0" />
                  <label for="totalPages">Pages du livre</label>
                  <input id="totalPages" type="number" readonly value="" />
                  <button id="saveProgressBtn">Sauver</button>
                  <p id="progressMsg" class="status"></p>
                </div>
                <div class="soft stack">
                  <div class="row" style="justify-content:space-between">
                    <h3>Progression globale</h3>
                    <button id="reloadProgressBtn" class="secondary">Voir</button>
                  </div>
                  <div id="progressList" class="list"></div>
                </div>
              </div>
            </section>

            <section id="tab-reviews" class="tabPanel hidden stack">
              <div class="grid-2">
                <div class="soft stack">
                  <h3 id="reviewFormTitle">Mon avis</h3>
                  <div id="reviewBookLabel" class="muted">Aucun livre selectionne.</div>
                  <label for="reviewRating">Note</label>
                  <select id="reviewRating">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Tres bien</option>
                    <option value="3">3 - Correct</option>
                    <option value="2">2 - Moyen</option>
                    <option value="1">1 - Mauvais</option>
                  </select>
                  <label for="reviewComment">Commentaire</label>
                  <textarea id="reviewComment">Lecture interessante.</textarea>
                  <div class="row">
                    <button id="saveReviewBtn">Sauver l'avis</button>
                    <button id="clearReviewBtn" class="secondary">Vider</button>
                  </div>
                  <p id="reviewMsg" class="status"></p>
                </div>
                <div class="soft stack">
                  <div class="row" style="justify-content:space-between">
                    <h3>Avis du livre</h3>
                    <button id="reloadReviewsBtn" class="secondary">Rafraichir</button>
                  </div>
                  <div id="reviewList" class="list"></div>
                </div>
              </div>
            </section>
          </div>

          <div class="panel stack">
            <h2>Derniere reponse API</h2>
            <pre id="apiOutput">Pret.</pre>
          </div>
        </div>
      </div>
    </section>

    <section id="adminView" class="hidden stack">
      <div class="panel stack">
        <div class="row" style="justify-content:space-between">
          <div>
            <h2>Administration</h2>
            <p class="muted">Vue reservee aux administrateurs globaux. Elle permet de tester la gestion complete sans appartenir aux clubs.</p>
          </div>
          <button id="leaveAdminBtn" class="secondary">Retour aux clubs</button>
        </div>
        <div class="grid-2">
          <div class="soft stack">
            <div class="row" style="justify-content:space-between">
              <h3>Utilisateurs</h3>
              <button id="reloadUsersBtn" class="secondary">Rafraichir</button>
            </div>
            <div id="adminUserList" class="list"></div>
            <p id="adminUserMsg" class="status"></p>
          </div>
          <div class="soft stack">
            <div class="row" style="justify-content:space-between">
              <h3>Tous les clubs</h3>
              <button id="reloadAdminClubsBtn" class="secondary">Rafraichir</button>
            </div>
            <div id="adminClubList" class="list"></div>
            <p id="adminClubMsg" class="status"></p>
          </div>
        </div>
        <div class="soft stack">
          <h3>Import CSV catalogue livres</h3>
          <p class="muted">Colonnes attendues: isbn,title,author,genre,pageCount,description,publishedAt.</p>
          <textarea id="catalogCsv" style="min-height:150px">isbn,title,author,genre,pageCount,description,publishedAt
9782070612758,Le Petit Prince,Antoine de Saint-Exupery,Conte,120,Un classique,1943-04-06
9782070360024,L'Etranger,Albert Camus,Roman,186,Un roman majeur,1942-01-01</textarea>
          <button id="importCatalogBtn">Importer le catalogue</button>
          <p id="catalogImportMsg" class="status"></p>
          <pre id="catalogImportOutput">Aucun import.</pre>
        </div>
      </div>
    </section>
  </main>

  <script>
    const api = location.origin;
    const state = {
      user: null,
      clubs: [],
      adminUsers: [],
      selectedClub: null,
      members: [],
      books: [],
      reviews: [],
      selectedBook: null,
      selectedReview: null,
      membership: null
    };

    const el = (id) => document.getElementById(id);
    const randomEmail = 'reader-' + Date.now() + '@test.com';
    el('authEmail').value = randomEmail;

    function showOutput(data) {
      el('apiOutput').textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    }

    function message(id, text, kind) {
      const node = el(id);
      node.textContent = text || '';
      node.className = 'status ' + (kind || '');
    }

    function friendlyError(path, response, body) {
      let msg = body && body.message ? body.message : response.statusText;
      if (Array.isArray(msg)) msg = msg.join(', ');
      if (response.status === 401) return 'Tu dois etre connecte pour faire cette action.';
      if (response.status === 403 && path.includes('/members')) return 'Action refusee: seul un OWNER du club peut gerer les membres.';
      if (response.status === 403 && path.includes('/books')) return 'Action refusee: il faut etre membre pour lire, et OWNER ou EDITOR pour modifier les livres.';
      if (response.status === 403 && path.includes('/progress')) return 'Action refusee: seuls OWNER et EDITOR peuvent voir la progression globale.';
      if (response.status === 422 && path.includes('/sign-up/email')) return 'Inscription refusee: email deja utilise ou donnees invalides.';
      return msg || 'Erreur API';
    }

    async function request(path, options) {
      const response = await fetch(api + path, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...(options || {})
      });
      const text = await response.text();
      let body = text;
      try { body = text ? JSON.parse(text) : null; } catch (_) {}
      showOutput(body);
      if (!response.ok) throw new Error(friendlyError(path, response, body));
      return body;
    }

    function role() {
      if (isAdmin()) return 'ADMIN';
      return state.membership ? state.membership.role : null;
    }

    function isAdmin() {
      return state.user && state.user.role === 'ADMIN';
    }

    function isOwner() {
      return role() === 'OWNER' || isAdmin();
    }

    function canEditBooks() {
      return role() === 'OWNER' || role() === 'EDITOR' || isAdmin();
    }

    function canSaveOwnProgress() {
      return !!state.membership && !!state.selectedBook;
    }

    function setAuthenticated(user) {
      state.user = user;
      el('authView').classList.toggle('hidden', !!user);
      el('appView').classList.toggle('hidden', !user);
      el('adminView').classList.add('hidden');
      el('adminModeBtn').classList.toggle('hidden', !user || user.role !== 'ADMIN');
      el('logoutBtn').classList.toggle('hidden', !user);
      el('sessionBadge').textContent = user ? user.email + ' - ' + user.role : 'Non connecte';
      el('sessionBadge').className = user ? 'pill ok' : 'pill warn';
      if (user) refreshClubs();
    }

    function renderPublicClubs() {
      const list = el('publicClubList');
      list.innerHTML = '';
      if (!state.clubs.length) {
        list.innerHTML = '<p class="muted">Aucun club public pour le moment.</p>';
        return;
      }
      state.clubs.forEach((club) => {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = '<strong></strong><div class="muted"></div><span class="pill"></span>';
        item.querySelector('strong').textContent = club.name;
        item.querySelector('.muted').textContent = club.description || 'Sans description';
        item.querySelector('.pill').textContent = club.memberCount + ' membre(s)';
        list.appendChild(item);
      });
    }

    function renderClubs() {
      const list = el('clubList');
      list.innerHTML = '';
      if (!state.clubs.length) {
        list.innerHTML = '<p class="muted">Aucun club public.</p>';
        return;
      }
      state.clubs.forEach((club) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'item secondary' + (state.selectedClub && state.selectedClub.id === club.id ? ' selected' : '');
        item.innerHTML = '<strong></strong><span class="muted"></span>';
        item.querySelector('strong').textContent = club.name;
        item.querySelector('span').textContent = (club.description || 'Sans description') + ' - ' + club.memberCount + ' membre(s)';
        item.addEventListener('click', () => selectClub(club));
        list.appendChild(item);
      });
    }

    function renderWorkspace() {
      const hasClub = !!state.selectedClub;
      el('emptyState').classList.toggle('hidden', hasClub);
      el('clubWorkspace').classList.toggle('hidden', !hasClub);
      if (!hasClub) return;

      el('selectedClubName').textContent = state.selectedClub.name;
      el('selectedClubMeta').textContent = (state.selectedClub.description || 'Sans description') + ' - ' + (state.selectedClub.isPublic ? 'public' : 'prive');
      el('clubRoleBadge').textContent = role() || 'Non membre';
      el('clubRoleBadge').className = role() ? 'pill ok' : 'pill warn';
      el('permissionHint').textContent = rightsText();
      el('rightsSummary').textContent = rightsText();

      el('updateClubBtn').disabled = !isOwner();
      el('deleteClubBtn').disabled = !isOwner();
      el('inviteBtn').disabled = !isOwner();
      el('createBookBtn').disabled = !canEditBooks();
      el('updateBookBtn').disabled = !canEditBooks() || !state.selectedBook;
      el('saveProgressBtn').disabled = !canSaveOwnProgress();
      el('saveReviewBtn').disabled = !role() || !state.selectedBook;
      renderMembers();
      renderBooks();
      renderProgress([]);
      renderReviews();
    }

    function rightsText() {
      if (!role()) return 'Tu peux voir le club public, mais tu dois etre membre pour consulter les livres et la progression.';
      if (role() === 'ADMIN') return 'ADMIN: tu peux gerer tous les clubs, membres et livres sans etre membre. Pour ta progression personnelle, il faut rester membre du club.';
      if (role() === 'OWNER') return 'OWNER: tu peux modifier le club, gerer les membres, gerer les livres et voir la progression globale.';
      if (role() === 'EDITOR') return 'EDITOR: tu peux gerer les livres et voir la progression globale.';
      return 'READER: tu peux consulter les livres et mettre a jour ta progression.';
    }

    function renderMembers() {
      const list = el('memberList');
      list.innerHTML = '';
      if (!state.members.length) {
        list.innerHTML = '<p class="muted">Aucun membre charge.</p>';
        return;
      }
      state.members.forEach((member) => {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = '<strong></strong><div class="muted"></div><div class="row"><select><option value="OWNER">OWNER</option><option value="EDITOR">EDITOR</option><option value="READER">READER</option></select><button class="secondary">Changer</button><button class="danger">Retirer</button></div>';
        item.querySelector('strong').textContent = member.user.name || member.user.email;
        item.querySelector('.muted').textContent = member.user.email;
        const select = item.querySelector('select');
        select.value = member.role;
        select.disabled = !isOwner();
        const buttons = item.querySelectorAll('button');
        buttons[0].disabled = !isOwner();
        buttons[1].disabled = !isOwner();
        buttons[0].addEventListener('click', () => updateMemberRole(member.id, select.value));
        buttons[1].addEventListener('click', () => removeMember(member.id));
        list.appendChild(item);
      });
    }

    function renderBooks() {
      const list = el('bookList');
      list.innerHTML = '';
      if (!role()) {
        list.innerHTML = '<p class="muted">Connecte-toi comme membre du club pour voir les livres.</p>';
        return;
      }
      if (!state.books.length) {
        list.innerHTML = '<p class="muted">Aucun livre pour ce club.</p>';
        return;
      }
      state.books.forEach((book) => {
        const item = document.createElement('div');
        item.className = 'item' + (state.selectedBook && state.selectedBook.id === book.id ? ' selected' : '');
        item.innerHTML = '<strong></strong><div class="muted"></div><div class="row"><span class="pill"></span><button class="secondary">Selectionner</button><button class="danger">Supprimer</button></div>';
        item.querySelector('strong').textContent = book.title;
        item.querySelector('.muted').textContent = book.author + (book.genre ? ' - ' + book.genre : '') + (book.averageRating ? ' - note ' + Number(book.averageRating).toFixed(1) + '/5' : '');
        item.querySelector('.pill').textContent = book.pageCount ? book.pageCount + ' pages' : 'pages ?';
        const buttons = item.querySelectorAll('button');
        buttons[0].addEventListener('click', () => selectBook(book));
        buttons[1].disabled = !canEditBooks();
        buttons[1].addEventListener('click', () => deleteBook(book.id));
        list.appendChild(item);
      });
    }

    function renderProgress(items) {
      const list = el('progressList');
      list.innerHTML = '';
      if (!state.selectedBook) {
        list.innerHTML = '<p class="muted">Selectionne un livre.</p>';
        return;
      }
      if (!items.length) {
        list.innerHTML = '<p class="muted">Aucune progression globale chargee.</p>';
        return;
      }
      items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'item';
        row.innerHTML = '<strong></strong><div class="muted"></div><span class="pill"></span>';
        row.querySelector('strong').textContent = item.user && item.user.name ? item.user.name : item.userId;
        row.querySelector('.muted').textContent = item.currentPage + '/' + (item.totalPages || '?') + ' pages - ' + item.status;
        row.querySelector('.pill').textContent = item.progressPercent + '%';
        list.appendChild(row);
      });
    }

    function renderReviews() {
      const list = el('reviewList');
      list.innerHTML = '';
      if (!state.selectedBook) {
        list.innerHTML = '<p class="muted">Selectionne un livre.</p>';
        return;
      }
      if (!role()) {
        list.innerHTML = '<p class="muted">Tu dois etre membre ou admin pour voir les avis.</p>';
        return;
      }
      if (!state.reviews.length) {
        list.innerHTML = '<p class="muted">Aucun avis pour ce livre.</p>';
        return;
      }

      state.reviews.forEach((review) => {
        const canManage = isAdmin() || (state.user && review.userId === state.user.id);
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = '<strong></strong><div class="muted"></div><p class="muted"></p><div class="row"><span class="pill"></span><button class="secondary">Modifier</button><button class="danger">Supprimer</button></div>';
        item.querySelector('strong').textContent = review.user && (review.user.name || review.user.email) ? (review.user.name || review.user.email) : review.userId;
        item.querySelectorAll('.muted')[0].textContent = review.user && review.user.email ? review.user.email : '';
        item.querySelectorAll('.muted')[1].textContent = review.comment || 'Sans commentaire';
        item.querySelector('.pill').textContent = review.rating + '/5';
        const buttons = item.querySelectorAll('button');
        buttons[0].disabled = !canManage;
        buttons[1].disabled = !canManage;
        buttons[0].addEventListener('click', () => selectReview(review));
        buttons[1].addEventListener('click', () => deleteReview(review.id));
        list.appendChild(item);
      });
    }

    function renderAdminUsers() {
      const list = el('adminUserList');
      list.innerHTML = '';
      if (!state.adminUsers.length) {
        list.innerHTML = '<p class="muted">Aucun utilisateur charge.</p>';
        return;
      }

      state.adminUsers.forEach((user) => {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = '<strong></strong><div class="muted"></div><div class="row"><select><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select><button class="secondary">Changer role</button><button class="danger"></button></div>';
        item.querySelector('strong').textContent = user.name || user.email;
        item.querySelector('.muted').textContent = user.email + ' - ' + (user.banned ? 'desactive' : 'actif');
        const select = item.querySelector('select');
        select.value = user.role;
        const buttons = item.querySelectorAll('button');
        buttons[0].addEventListener('click', () => updateAdminUserRole(user.id, select.value));
        buttons[1].textContent = user.banned ? 'Reactiver' : 'Desactiver';
        buttons[1].addEventListener('click', () => toggleAdminUser(user));
        list.appendChild(item);
      });
    }

    function renderAdminClubs() {
      const list = el('adminClubList');
      list.innerHTML = '';
      if (!state.clubs.length) {
        list.innerHTML = '<p class="muted">Aucun club charge.</p>';
        return;
      }

      state.clubs.forEach((club) => {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = '<strong></strong><div class="muted"></div><div class="row"><span class="pill"></span><button class="secondary">Administrer</button><button class="danger">Supprimer</button></div>';
        item.querySelector('strong').textContent = club.name;
        item.querySelector('.muted').textContent = (club.description || 'Sans description') + ' - ' + (club.isPublic ? 'public' : 'prive');
        item.querySelector('.pill').textContent = club.memberCount + ' membre(s), ' + club.bookCount + ' livre(s)';
        const buttons = item.querySelectorAll('button');
        buttons[0].addEventListener('click', async () => {
          showAppMode();
          await selectClub(club);
        });
        buttons[1].addEventListener('click', () => deleteAdminClub(club.id));
        list.appendChild(item);
      });
    }

    async function refreshClubs() {
      try {
        const result = await request(isAdmin() ? '/admin/clubs' : '/clubs');
        state.clubs = result.data || [];
        renderPublicClubs();
        renderClubs();
        if (isAdmin()) renderAdminClubs();
      } catch (error) {
        message('clubCreateMsg', error.message, 'error');
      }
    }

    async function selectClub(club) {
      state.selectedClub = club;
      state.selectedBook = null;
      state.members = [];
      state.books = [];
      state.reviews = [];
      state.membership = null;
      el('editClubName').value = club.name;
      el('editClubDescription').value = club.description || '';
      el('editClubPublic').value = String(club.isPublic);
      clearBookForm();
      renderClubs();
      renderWorkspace();
      await loadMembers();
      await loadBooks();
    }

    async function loadMembers() {
      if (!state.selectedClub) return;
      try {
        state.members = await request('/clubs/' + state.selectedClub.id + '/members');
        state.membership = state.members.find((member) => state.user && member.userId === state.user.id) || null;
        renderWorkspace();
      } catch (error) {
        state.members = [];
        state.membership = null;
        renderWorkspace();
        message('memberMsg', error.message, 'error');
      }
    }

    function bookQuery() {
      const params = new URLSearchParams();
      if (el('filterTitle').value.trim()) params.set('title', el('filterTitle').value.trim());
      if (el('filterAuthor').value.trim()) params.set('author', el('filterAuthor').value.trim());
      if (el('filterGenre').value.trim()) params.set('genre', el('filterGenre').value.trim());
      const query = params.toString();
      return query ? '?' + query : '';
    }

    async function loadBooks() {
      if (!state.selectedClub || !role()) {
        state.books = [];
        renderBooks();
        return;
      }
      try {
        const result = await request('/clubs/' + state.selectedClub.id + '/books' + bookQuery());
        state.books = result.data || [];
        if (state.selectedBook) {
          const refreshed = state.books.find((book) => book.id === state.selectedBook.id);
          if (refreshed) {
            state.selectedBook = refreshed;
            updateSelectedBookLabels();
          }
        }
        renderBooks();
      } catch (error) {
        state.books = [];
        renderBooks();
        message('bookMsg', error.message, 'error');
      }
    }

    function selectBook(book) {
      state.selectedBook = book;
      state.selectedReview = null;
      el('bookFormTitle').textContent = 'Modifier le livre selectionne';
      el('bookTitle').value = book.title;
      el('bookAuthor').value = book.author;
      el('bookGenre').value = book.genre || '';
      el('bookPageCount').value = book.pageCount || '';
      el('bookIsbn').value = book.isbn || '';
      el('bookDescription').value = book.description || '';
      el('selectedBookLabel').textContent = book.title + ' - ' + (book.pageCount || '?') + ' pages';
      el('totalPages').value = book.pageCount || '';
      updateSelectedBookLabels();
      clearReviewForm(false);
      renderWorkspace();
      loadReviews();
    }

    function updateSelectedBookLabels() {
      if (!state.selectedBook) return;
      el('selectedBookLabel').textContent = state.selectedBook.title + ' - ' + (state.selectedBook.pageCount || '?') + ' pages';
      el('totalPages').value = state.selectedBook.pageCount || '';
      el('reviewBookLabel').textContent = state.selectedBook.title + (state.selectedBook.averageRating ? ' - moyenne ' + Number(state.selectedBook.averageRating).toFixed(1) + '/5' : ' - pas encore de moyenne');
    }

    function clearBookForm() {
      state.selectedBook = null;
      state.selectedReview = null;
      state.reviews = [];
      el('bookFormTitle').textContent = 'Ajouter un livre';
      el('bookTitle').value = 'Le Petit Prince';
      el('bookAuthor').value = 'Antoine de Saint-Exupery';
      el('bookGenre').value = 'Conte';
      el('bookPageCount').value = '120';
      el('bookIsbn').value = '';
      el('bookDescription').value = 'Un classique a lire ensemble.';
      el('selectedBookLabel').textContent = 'Aucun livre selectionne.';
      el('reviewBookLabel').textContent = 'Aucun livre selectionne.';
      renderWorkspace();
    }

    function selectReview(review) {
      state.selectedReview = review;
      el('reviewFormTitle').textContent = 'Modifier un avis';
      el('reviewRating').value = String(review.rating);
      el('reviewComment').value = review.comment || '';
      message('reviewMsg', 'Avis charge dans le formulaire.', 'ok');
    }

    function clearReviewForm(resetSelected) {
      if (resetSelected !== false) {
        state.selectedReview = null;
      }
      el('reviewFormTitle').textContent = 'Mon avis';
      el('reviewRating').value = '5';
      el('reviewComment').value = 'Lecture interessante.';
    }

    async function login() {
      try {
        const body = await request('/auth/sign-in/email', {
          method: 'POST',
          body: JSON.stringify({
            email: el('authEmail').value,
            password: el('authPassword').value,
            rememberMe: true
          })
        });
        setAuthenticated(body.user);
        message('authMsg', 'Connexion OK.', 'ok');
      } catch (error) {
        message('authMsg', error.message, 'error');
      }
    }

    async function register() {
      try {
        const body = await request('/auth/sign-up/email', {
          method: 'POST',
          body: JSON.stringify({
            name: el('authName').value,
            email: el('authEmail').value || randomEmail,
            password: el('authPassword').value
          })
        });
        setAuthenticated(body.user);
        message('authMsg', 'Inscription OK.', 'ok');
      } catch (error) {
        message('authMsg', error.message, 'error');
      }
    }

    async function logout() {
      try {
        await request('/auth/sign-out', { method: 'POST', body: '{}' });
      } catch (_) {}
      state.user = null;
      state.selectedClub = null;
      state.selectedBook = null;
      state.adminUsers = [];
      setAuthenticated(null);
      await refreshClubs();
    }

    function showAdminMode() {
      if (!isAdmin()) {
        message('authMsg', 'Mode admin reserve aux administrateurs.', 'error');
        return;
      }
      el('authView').classList.add('hidden');
      el('appView').classList.add('hidden');
      el('adminView').classList.remove('hidden');
      refreshClubs();
      loadAdminUsers();
    }

    function showAppMode() {
      el('adminView').classList.add('hidden');
      el('appView').classList.remove('hidden');
    }

    async function loadAdminUsers() {
      try {
        const result = await request('/users?limit=100');
        state.adminUsers = result.data || [];
        renderAdminUsers();
        message('adminUserMsg', 'Utilisateurs charges.', 'ok');
      } catch (error) {
        message('adminUserMsg', error.message, 'error');
      }
    }

    async function updateAdminUserRole(userId, nextRole) {
      try {
        await request('/users/' + userId, {
          method: 'PATCH',
          body: JSON.stringify({ role: nextRole })
        });
        message('adminUserMsg', 'Role utilisateur modifie.', 'ok');
        await loadAdminUsers();
      } catch (error) {
        message('adminUserMsg', error.message, 'error');
      }
    }

    async function toggleAdminUser(user) {
      try {
        await request('/admin/users/' + user.id + (user.banned ? '/enable' : '/disable'), {
          method: 'PATCH',
          body: '{}'
        });
        message('adminUserMsg', user.banned ? 'Utilisateur reactive.' : 'Utilisateur desactive.', 'ok');
        await loadAdminUsers();
      } catch (error) {
        message('adminUserMsg', error.message, 'error');
      }
    }

    async function importCatalogBooks() {
      try {
        const report = await request('/admin/imports/catalog-books', {
          method: 'POST',
          body: JSON.stringify({ csv: el('catalogCsv').value })
        });
        el('catalogImportOutput').textContent = JSON.stringify(report, null, 2);
        message('catalogImportMsg', report.errors.length ? 'Import annule: corrige les erreurs.' : report.imported + ' livre(s) importe(s).', report.errors.length ? 'error' : 'ok');
      } catch (error) {
        message('catalogImportMsg', error.message, 'error');
      }
    }

    async function deleteAdminClub(clubId) {
      if (!confirm('Supprimer ce club en tant qu admin ?')) return;
      try {
        await request('/clubs/' + clubId, { method: 'DELETE' });
        message('adminClubMsg', 'Club supprime.', 'ok');
        if (state.selectedClub && state.selectedClub.id === clubId) {
          state.selectedClub = null;
          state.selectedBook = null;
          renderWorkspace();
        }
        await refreshClubs();
      } catch (error) {
        message('adminClubMsg', error.message, 'error');
      }
    }

    async function createClub() {
      try {
        const club = await request('/clubs', {
          method: 'POST',
          body: JSON.stringify({
            name: el('newClubName').value,
            description: el('newClubDescription').value,
            isPublic: el('newClubPublic').value === 'true'
          })
        });
        message('clubCreateMsg', 'Club cree.', 'ok');
        await refreshClubs();
        await selectClub(club);
      } catch (error) {
        message('clubCreateMsg', error.message, 'error');
      }
    }

    async function updateClub() {
      try {
        const club = await request('/clubs/' + state.selectedClub.id, {
          method: 'PATCH',
          body: JSON.stringify({
            name: el('editClubName').value,
            description: el('editClubDescription').value,
            isPublic: el('editClubPublic').value === 'true'
          })
        });
        message('clubEditMsg', 'Club modifie.', 'ok');
        await refreshClubs();
        await selectClub(club);
      } catch (error) {
        message('clubEditMsg', error.message, 'error');
      }
    }

    async function deleteClub() {
      if (!state.selectedClub || !confirm('Supprimer ce club ?')) return;
      try {
        await request('/clubs/' + state.selectedClub.id, { method: 'DELETE' });
        state.selectedClub = null;
        state.selectedBook = null;
        message('clubEditMsg', 'Club supprime.', 'ok');
        await refreshClubs();
        renderWorkspace();
      } catch (error) {
        message('clubEditMsg', error.message, 'error');
      }
    }

    async function inviteMember() {
      try {
        const result = await request('/clubs/' + state.selectedClub.id + '/members/invitations', {
          method: 'POST',
          body: JSON.stringify({
            email: el('inviteEmail').value,
            role: el('inviteRole').value
          })
        });
        message('memberMsg', result.status === 'PENDING_INVITATION' ? 'Invitation creee.' : 'Utilisateur ajoute.', 'ok');
        await loadMembers();
        await refreshClubs();
      } catch (error) {
        message('memberMsg', error.message, 'error');
      }
    }

    async function importMembers() {
      if (!state.selectedClub) {
        message('memberImportMsg', 'Selectionne un club.', 'error');
        return;
      }
      try {
        const report = await request('/clubs/' + state.selectedClub.id + '/imports/members', {
          method: 'POST',
          body: JSON.stringify({ csv: el('memberCsv').value })
        });
        el('memberImportOutput').textContent = JSON.stringify(report, null, 2);
        message('memberImportMsg', report.errors.length ? 'Import annule: corrige les erreurs.' : report.imported + ' ligne(s) importee(s).', report.errors.length ? 'error' : 'ok');
        await loadMembers();
        await refreshClubs();
      } catch (error) {
        message('memberImportMsg', error.message, 'error');
      }
    }

    async function updateMemberRole(memberId, nextRole) {
      try {
        await request('/clubs/' + state.selectedClub.id + '/members/' + memberId, {
          method: 'PATCH',
          body: JSON.stringify({ role: nextRole })
        });
        message('memberMsg', 'Role modifie.', 'ok');
        await loadMembers();
      } catch (error) {
        message('memberMsg', error.message, 'error');
      }
    }

    async function removeMember(memberId) {
      try {
        await request('/clubs/' + state.selectedClub.id + '/members/' + memberId, { method: 'DELETE' });
        message('memberMsg', 'Membre retire.', 'ok');
        await loadMembers();
        await refreshClubs();
      } catch (error) {
        message('memberMsg', error.message, 'error');
      }
    }

    function bookPayload() {
      const pageCount = Number(el('bookPageCount').value);
      return {
        title: el('bookTitle').value,
        author: el('bookAuthor').value,
        genre: el('bookGenre').value,
        pageCount: pageCount > 0 ? pageCount : undefined,
        isbn: el('bookIsbn').value,
        description: el('bookDescription').value
      };
    }

    async function createBook() {
      try {
        const book = await request('/clubs/' + state.selectedClub.id + '/books', {
          method: 'POST',
          body: JSON.stringify(bookPayload())
        });
        message('bookMsg', 'Livre ajoute.', 'ok');
        await loadBooks();
        selectBook(book);
      } catch (error) {
        message('bookMsg', error.message, 'error');
      }
    }

    async function updateBook() {
      if (!state.selectedBook) {
        message('bookMsg', 'Selectionne un livre a modifier.', 'error');
        return;
      }
      try {
        const book = await request('/clubs/' + state.selectedClub.id + '/books/' + state.selectedBook.id, {
          method: 'PATCH',
          body: JSON.stringify(bookPayload())
        });
        message('bookMsg', 'Livre modifie.', 'ok');
        await loadBooks();
        selectBook(book);
      } catch (error) {
        message('bookMsg', error.message, 'error');
      }
    }

    async function deleteBook(bookId) {
      if (!confirm('Supprimer ce livre ?')) return;
      try {
        await request('/clubs/' + state.selectedClub.id + '/books/' + bookId, { method: 'DELETE' });
        if (state.selectedBook && state.selectedBook.id === bookId) clearBookForm();
        message('bookMsg', 'Livre supprime.', 'ok');
        await loadBooks();
      } catch (error) {
        message('bookMsg', error.message, 'error');
      }
    }

    async function saveProgress() {
      if (!state.selectedBook) {
        message('progressMsg', 'Selectionne un livre.', 'error');
        return;
      }
      try {
        const progress = await request('/clubs/' + state.selectedClub.id + '/books/' + state.selectedBook.id + '/progress/me', {
          method: 'PATCH',
          body: JSON.stringify({
            status: el('progressStatus').value,
            currentPage: Number(el('currentPage').value),
          })
        });
        message('progressMsg', 'Progression sauvegardee: ' + progress.progressPercent + '% - ' + progress.status, 'ok');
      } catch (error) {
        message('progressMsg', error.message, 'error');
      }
    }

    async function loadProgress() {
      if (!state.selectedBook) {
        message('progressMsg', 'Selectionne un livre.', 'error');
        return;
      }
      try {
        const items = await request('/clubs/' + state.selectedClub.id + '/books/' + state.selectedBook.id + '/progress');
        renderProgress(items);
        message('progressMsg', 'Progression globale chargee.', 'ok');
      } catch (error) {
        renderProgress([]);
        message('progressMsg', error.message, 'error');
      }
    }

    async function loadReviews() {
      if (!state.selectedBook) {
        message('reviewMsg', 'Selectionne un livre.', 'error');
        return;
      }
      try {
        state.reviews = await request('/clubs/' + state.selectedClub.id + '/books/' + state.selectedBook.id + '/reviews');
        renderReviews();
        message('reviewMsg', 'Avis charges.', 'ok');
      } catch (error) {
        state.reviews = [];
        renderReviews();
        message('reviewMsg', error.message, 'error');
      }
    }

    async function saveReview() {
      if (!state.selectedBook) {
        message('reviewMsg', 'Selectionne un livre.', 'error');
        return;
      }
      try {
        const ownReview = state.reviews.find((review) => state.user && review.userId === state.user.id);
        const reviewToUpdate = state.selectedReview || ownReview;
        const payload = {
          rating: Number(el('reviewRating').value),
          comment: el('reviewComment').value
        };
        const path = '/clubs/' + state.selectedClub.id + '/books/' + state.selectedBook.id + '/reviews' + (reviewToUpdate ? '/' + reviewToUpdate.id : '');
        const method = reviewToUpdate ? 'PATCH' : 'POST';
        const review = await request(path, {
          method,
          body: JSON.stringify(payload)
        });
        state.selectedReview = review;
        message('reviewMsg', reviewToUpdate ? 'Avis modifie.' : 'Avis cree.', 'ok');
        await loadReviews();
        await loadBooks();
      } catch (error) {
        message('reviewMsg', error.message, 'error');
      }
    }

    async function deleteReview(reviewId) {
      if (!confirm('Supprimer cet avis ?')) return;
      try {
        await request('/clubs/' + state.selectedClub.id + '/books/' + state.selectedBook.id + '/reviews/' + reviewId, { method: 'DELETE' });
        if (state.selectedReview && state.selectedReview.id === reviewId) {
          clearReviewForm();
        }
        message('reviewMsg', 'Avis supprime.', 'ok');
        await loadReviews();
        await loadBooks();
      } catch (error) {
        message('reviewMsg', error.message, 'error');
      }
    }

    function switchTab(name) {
      document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === name));
      document.querySelectorAll('.tabPanel').forEach((panel) => panel.classList.add('hidden'));
      el('tab-' + name).classList.remove('hidden');
    }

    document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
    el('loginBtn').addEventListener('click', login);
    el('registerBtn').addEventListener('click', register);
    el('logoutBtn').addEventListener('click', logout);
    el('adminModeBtn').addEventListener('click', showAdminMode);
    el('leaveAdminBtn').addEventListener('click', showAppMode);
    el('reloadUsersBtn').addEventListener('click', loadAdminUsers);
    el('reloadAdminClubsBtn').addEventListener('click', refreshClubs);
    el('importCatalogBtn').addEventListener('click', importCatalogBooks);
    el('reloadClubsBtn').addEventListener('click', refreshClubs);
    el('createClubBtn').addEventListener('click', createClub);
    el('updateClubBtn').addEventListener('click', updateClub);
    el('deleteClubBtn').addEventListener('click', deleteClub);
    el('inviteBtn').addEventListener('click', inviteMember);
    el('importMembersBtn').addEventListener('click', importMembers);
    el('createBookBtn').addEventListener('click', createBook);
    el('updateBookBtn').addEventListener('click', updateBook);
    el('clearBookBtn').addEventListener('click', clearBookForm);
    el('reloadBooksBtn').addEventListener('click', loadBooks);
    el('filterBooksBtn').addEventListener('click', loadBooks);
    el('saveProgressBtn').addEventListener('click', saveProgress);
    el('reloadProgressBtn').addEventListener('click', loadProgress);
    el('saveReviewBtn').addEventListener('click', saveReview);
    el('clearReviewBtn').addEventListener('click', () => clearReviewForm());
    el('reloadReviewsBtn').addEventListener('click', loadReviews);

    refreshClubs();
  </script>
</body>
</html>`;
  }
}
