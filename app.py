from flask import Flask, render_template, abort
from datetime import datetime
import json

app = Flask(__name__)

CATEGORY_META = {
    "Cyber Security": {"icon": "fa-shield-halved", "tag": "SECURITY"},
    "Full-Stack": {"icon": "fa-layer-group", "tag": "WEB_APP"},
    "Game": {"icon": "fa-gamepad", "tag": "GAME"},
}
DEFAULT_META = {"icon": "fa-folder-open", "tag": "PROJECT"}


def load_data():
    try:
        with open('data.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


@app.context_processor
def inject_data():
    data = load_data()
    return dict(profile=data.get('profile', {}), current_year=datetime.now().year)


@app.route('/')
def home():
    data = load_data()
    return render_template(
        'home.html',
        projects=data.get('projects', []),
        services=data.get('services', []),
        stats=data.get('stats', []),
        experience=data.get('experience', []),
        education=data.get('education', []),
        skills=data.get('skills', []),
        certificates=data.get('certificates', [])
    )


@app.route('/project/<int:id>')
def project_detail(id):
    data = load_data()
    projects = data.get('projects', [])
    project = next((p for p in projects if p['id'] == id), None)
    if not project:
        abort(404)

    meta = CATEGORY_META.get(project.get('category'), DEFAULT_META)

    # Find the next project in the list for simple "what's next" navigation.
    ids = [p['id'] for p in projects]
    idx = ids.index(id)
    next_project = projects[(idx + 1) % len(projects)] if len(projects) > 1 else None

    return render_template(
        'project_detail.html',
        project=project,
        icon=meta['icon'],
        tag=meta['tag'],
        next_project=next_project
    )


@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, port=5001)
