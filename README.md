# SolidSpaw Września

Premium strona wizytówka firmy spawalniczej.

## Uruchomienie

Otwórz `index.html` w przeglądarce lub:

```bash
python -m http.server 3456
```

## Motywy

Przełączanie jasny/ciemny odbywa się bez przeładowania strony (przycisk w nawigacji). Preferencja zapisywana jest w `localStorage`.

`index-light.html` przekierowuje na stronę główną z jasnym motywem (kompatybilność wsteczna).

## Pliki

| Plik | Opis |
|------|------|
| `index.html` | Strona główna |
| `styles.css` | Design system (ciemny motyw domyślny) |
| `styles-light.css` | Nadpisania jasnego motywu |
| `script.js` | Nawigacja, motyw, formularz, galeria |
