-- =================================================================
--  SCRIPT DE SEEDING PARA LA APLICACIÓN DE LISTA DE TAREAS
--  Este script es idempotente y se puede ejecutar de forma segura varias veces.
-- =================================================================

-- Usamos un bloque de código procedural para generar datos dinámicos.
DO $$
DECLARE
  -- --- PARÁMETROS DE CONFIGURACIÓN ---
  num_users INT := 20;
  tasks_per_user INT := 50;
  
  -- --- VARIABLES INTERNAS ---
  user_id INT;
  category_id INT;
  tag_id INT;
  task_id INT;
  
  -- Variables para la lógica de tareas
  created_at_val TIMESTAMP;
  due_date_val TIMESTAMP;
  updated_at_val TIMESTAMP;
  completed_val BOOLEAN;
  priority_val "Priority";
  
  -- Arrays para seleccionar valores aleatorios
  priorities "Priority"[] := ARRAY['baja', 'media', 'alta'];
  
BEGIN
  -- Limpiar las tablas en el orden correcto para evitar conflictos de claves foráneas.
  -- RESTART IDENTITY reinicia los contadores SERIAL. CASCADE elimina registros dependientes.
  RAISE NOTICE 'Limpiando la base de datos...';
  TRUNCATE TABLE usuarios, categorias, etiquetas, tareas, tarea_etiquetas RESTART IDENTITY CASCADE;

    INSERT INTO "usuarios" ("name", "email", "password")
    VALUES ('John Doe', 'john.doe@example.com', '$2b$10$ft7KOJkoYPRQ9NhFgKzvrubRd1UbNGYQEwpNTgwnP1ZgmoE.lZBBa');

  -- 1. CREAR USUARIOS
  -- =================
  RAISE NOTICE 'Creando % usuarios...', num_users;
  FOR i IN 1..num_users LOOP
    INSERT INTO usuarios (name, email, password)
    VALUES (
      'Usuario ' || i,
      'usuario' || i || '@ejemplo.com',
      -- En un proyecto real, esto sería un hash de bcrypt
      '$2b$10$ft7KOJkoYPRQ9NhFgKzvrubRd1UbNGYQEwpNTgwnP1ZgmoE.lZBBa' 
    );
  END LOOP;

  -- 2. CREAR CATEGORÍAS Y ETIQUETAS PARA CADA USUARIO
  -- ================================================
  RAISE NOTICE 'Creando categorías y etiquetas para cada usuario...';
  FOR user_id IN (SELECT id FROM usuarios) LOOP
    -- Categorías comunes
    INSERT INTO categorias (name, "userId") VALUES
    ('Trabajo', user_id),
    ('Personal', user_id),
    ('Estudios', user_id);
    
    -- Etiquetas comunes
    INSERT INTO etiquetas (name, "userId") VALUES
    ('Urgente', user_id),
    ('Proyecto Alfa', user_id),
    ('Seguimiento', user_id),
    ('Idea', user_id);
  END LOOP;

  -- 3. CREAR TAREAS PARA CADA USUARIO
  -- =================================
  RAISE NOTICE 'Creando % tareas para cada uno de los % usuarios...', tasks_per_user, num_users;
  FOR user_id IN (SELECT id FROM usuarios) LOOP
    FOR i IN 1..tasks_per_user LOOP
      -- Generar una fecha de creación aleatoria en el último año
      created_at_val := NOW() - (random() * 365) * INTERVAL '1 day';
      
      -- Generar una fecha de vencimiento aleatoria entre 1 y 30 días después de la creación
      due_date_val := created_at_val + (random() * 30 + 1) * INTERVAL '1 day';
      
      -- Asignar prioridad aleatoria
      priority_val := priorities[floor(random() * 3 + 1)];
      
      -- Generar estado de completado. Hacemos que algunos usuarios sean más productivos.
      -- Los usuarios con ID divisible por 5 completan menos tareas.
      IF user_id % 5 = 0 THEN
        completed_val := random() > 0.6; -- ~40% de completado
      ELSE
        completed_val := random() > 0.2; -- ~80% de completado
      END IF;
      
      -- Si la tarea está completada, la fecha de actualización es entre la creación y el vencimiento.
      -- Si no, es la misma que la de creación.
      IF completed_val THEN
        updated_at_val := created_at_val + (random() * (EXTRACT(EPOCH FROM (due_date_val - created_at_val)))) * INTERVAL '1 second';
      ELSE
        updated_at_val := created_at_val;
      END IF;

      -- Asignar una categoría aleatoria de las que pertenecen al usuario.
      -- El 20% de las tareas no tendrán categoría.
      IF random() > 0.2 THEN
        SELECT id INTO category_id FROM categorias WHERE "userId" = user_id ORDER BY random() LIMIT 1;
      ELSE
        category_id := NULL;
      END IF;

      -- Insertar la tarea y obtener su ID
      INSERT INTO tareas (title, description, completed, priority, "dueDate", "createdAt", "updatedAt", "userId", "categoryId")
      VALUES (
        'Tarea ' || i || ' para Usuario ' || user_id,
        'Esta es una descripción detallada para la tarea número ' || i || '.',
        completed_val,
        priority_val,
        due_date_val,
        created_at_val,
        updated_at_val,
        user_id,
        category_id
      ) RETURNING id INTO task_id;
      
      -- 4. ASIGNAR ETIQUETAS A LA TAREA CREADA
      -- =======================================
      -- Asignar entre 0 y 3 etiquetas aleatorias a la tarea
      FOR j IN 1..floor(random() * 4) LOOP
        -- Seleccionar una etiqueta aleatoria que pertenezca al usuario
        SELECT id INTO tag_id FROM etiquetas WHERE "userId" = user_id ORDER BY random() LIMIT 1;
        
        -- Insertar en la tabla de unión, ignorando duplicados
        INSERT INTO tarea_etiquetas ("taskId", "tagId") VALUES (task_id, tag_id)
        ON CONFLICT ("taskId", "tagId") DO NOTHING;
      END LOOP;

    END LOOP;
  END LOOP;
  
  RAISE NOTICE '¡Script de seeding completado con éxito!';
END $$;