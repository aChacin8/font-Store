from flask import Flask, render_template, request, redirect, url_for, jsonify, flash, session
from flask_sqlalchemy import SQLAlchemy
import bcrypt
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'clave_secreta_segura'  # Cambia esto por una clave más segura

# Configuración de SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@127.0.0.1/punto_venta'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de usuarios
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(50), unique=True, nullable=False)
    contraseña = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.Enum('admin', 'usuario', 'almacenista', name='roles'), default='usuario', nullable=False)

# Modelo de productos
class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombre_producto = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)

# Función para registrar logs
def registrar_log(accion, detalle):
    """Registra una acción en el archivo de logs"""
    with open('logs.txt', 'a') as archivo:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        archivo.write(f'[{timestamp}] {accion}: {detalle}\n')

# Ruta principal - Página de login
@app.route('/')
def index():
    return render_template('login.html')

# Ruta para procesar el login
@app.route('/login', methods=['POST'])
def login():
    nombre_usuario = request.form['nombre_usuario']
    contraseña = request.form['contraseña']

    usuario = Usuario.query.filter_by(nombre_usuario=nombre_usuario).first()
    if usuario and bcrypt.checkpw(contraseña.encode('utf-8'), usuario.contraseña.encode('utf-8')):
        # Guardar el rol del usuario en la sesión
        session['usuario_id'] = usuario.id
        session['rol'] = usuario.rol

        # Registrar el inicio de sesión
        registrar_log("Inicio de sesión", f"Usuario: {nombre_usuario}, Rol: {usuario.rol}")

        # Redirigir según el rol
        if usuario.rol == 'admin':
            return redirect(url_for('admin_dashboard'))
        elif usuario.rol == 'almacenista':
            return redirect(url_for('almacenista_dashboard'))
        elif usuario.rol == 'usuario':
            return redirect(url_for('usuario_dashboard'))
    else:
        registrar_log("Error de inicio de sesión", f"Usuario: {nombre_usuario} - Contraseña incorrecta")
        flash('Usuario o contraseña incorrectos', 'danger')
        return redirect(url_for('index'))

# Ruta para registro de usuarios
@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre_usuario = request.form['nombre_usuario']
        contraseña = request.form['contraseña']
        rol = request.form.get('rol', 'usuario')  # Por defecto, rol "usuario"

        # Validación de duplicados
        if Usuario.query.filter_by(nombre_usuario=nombre_usuario).first():
            registrar_log("Error de registro", f"Usuario duplicado: {nombre_usuario}")
            flash('El nombre de usuario ya existe', 'danger')
            return redirect(url_for('registro'))

        # Crear nuevo usuario
        hash_contraseña = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        nuevo_usuario = Usuario(nombre_usuario=nombre_usuario, contraseña=hash_contraseña, rol=rol)
        db.session.add(nuevo_usuario)
        db.session.commit()

        registrar_log("Registro de usuario", f"Usuario: {nombre_usuario}, Rol: {rol}")
        flash('Usuario registrado exitosamente', 'success')
        return redirect(url_for('index'))
    return render_template('registro.html')

# Rutas para los roles
@app.route('/admin')
def admin_dashboard():
    if 'rol' in session and session['rol'] == 'admin':
        registrar_log("Acceso", "El administrador ingresó al dashboard")
        return render_template('admin.html')
    else:
        registrar_log("Acceso denegado", "Intento de acceso al dashboard de administrador")
        flash('Acceso denegado', 'danger')
        return redirect(url_for('index'))

@app.route('/almacenista')
def almacenista_dashboard():
    if 'rol' in session and session['rol'] == 'almacenista':
        registrar_log("Acceso", "El almacenista ingresó al dashboard")
        return render_template('almacenista.html')
    else:
        registrar_log("Acceso denegado", "Intento de acceso al dashboard de almacenista")
        flash('Acceso denegado', 'danger')
        return redirect(url_for('index'))

@app.route('/usuario')
def usuario_dashboard():
    if 'rol' in session and session['rol'] == 'usuario':
        registrar_log("Acceso", "El usuario ingresó al dashboard")
        return render_template('usuario.html')
    else:
        registrar_log("Acceso denegado", "Intento de acceso al dashboard de usuario")
        flash('Acceso denegado', 'danger')
        return redirect(url_for('index'))

# Ruta para mostrar los productos (solo usuarios)
@app.route('/productos')
def productos():
    if 'rol' in session and session['rol'] == 'usuario':
        lista_productos = Producto.query.all()
        registrar_log("Consulta", "El usuario visualizó los productos")
        return render_template('productos.html', productos=lista_productos)
    else:
        registrar_log("Acceso denegado", "Intento de acceso a productos")
        flash('Acceso denegado', 'danger')
        return redirect(url_for('index'))

# Ruta para cerrar sesión
@app.route('/logout')
def logout():
    registrar_log("Cierre de sesión", f"Usuario ID: {session.get('usuario_id', 'desconocido')} cerró sesión")
    session.clear()
    flash('Sesión cerrada correctamente', 'info')
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Crear las tablas si no existen
    with app.app_context():
        db.create_all()

    app.run(debug=True)
