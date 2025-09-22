/*¿Cuál es el promedio de tareas creadas por usuario en los últimos 30 días, y cómo se compara con los 30 días anteriores?*/

-- Respuesta esperada: 
/*



*/

WITH periodos AS (
  SELECT    
    COUNT(CASE WHEN "createdAt" >= NOW() - INTERVAL '30 days' THEN 1 END) AS tareas_periodo_actual,    
    COUNT(DISTINCT CASE WHEN "createdAt" >= NOW() - INTERVAL '30 days' THEN "userId" END) AS usuarios_periodo_actual,    
    COUNT(CASE WHEN "createdAt" >= NOW() - INTERVAL '60 days' AND "createdAt" < NOW() - INTERVAL '30 days' THEN 1 END) AS tareas_periodo_anterior,    
    COUNT(DISTINCT CASE WHEN "createdAt" >= NOW() - INTERVAL '60 days' AND "createdAt" < NOW() - INTERVAL '30 days' THEN "userId" END) AS usuarios_periodo_anterior
  FROM tareas
)
SELECT  
  ROUND(tareas_periodo_actual::numeric / NULLIF(usuarios_periodo_actual, 0), 2) AS promedio_tareas_ultimo_30_dias,
  ROUND(tareas_periodo_anterior::numeric / NULLIF(usuarios_periodo_anterior, 0), 2) AS promedio_tareas_30_dias_anteriores
FROM periodos;

----------------------------------------------------------------------

/*¿Cuál es la tasa de completado diaria de tareas en los últimos 90 días, agrupada por nivel de prioridad?*/

-- Respuesta esperada: 
/*



*/

SELECT
  DATE_TRUNC('day', "createdAt")::date AS dia,
  priority AS prioridad,
  SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS tareas_completadas,
  COUNT(*) AS total_tareas,
  ROUND(
    (SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(*), 0),
    2
  ) AS tasa_de_completado_porcentaje
FROM tareas
WHERE "createdAt" >= NOW() - INTERVAL '90 days'
GROUP BY dia, prioridad
ORDER BY dia DESC, prioridad;

----------------------------------------------------------------------

/*¿Qué categorías tienen las tasas de completado más altas y más bajas, y cuál es el tiempo promedio de completado para cada categoría?*/

-- Respuesta esperada: 
/*



*/

SELECT
  c.name AS categoria,  
  ROUND(
    (COUNT(t.id) FILTER (WHERE t.completed = true) * 100.0) / NULLIF(COUNT(t.id), 0),
    2
  ) AS tasa_de_completado_porcentaje,  
  AVG(t."updatedAt" - t."createdAt") AS tiempo_promedio_completado
  
FROM categorias c
JOIN tareas t ON c.id = t."categoryId"
WHERE t.completed = true
GROUP BY c.name
ORDER BY tasa_de_completado_porcentaje DESC;

----------------------------------------------------------------------

/*¿Cuáles son las horas pico y días de la semana cuando los usuarios crean más tareas, y cuándo las completan?*/

-- Respuesta esperada: 
/*



*/

WITH creacion AS (
  SELECT
    EXTRACT(ISODOW FROM "createdAt") AS dia_semana, -- 1=Lunes, 7=Domingo
    EXTRACT(HOUR FROM "createdAt") AS hora_del_dia,
    COUNT(*) AS num_tareas_creadas
  FROM tareas
  GROUP BY dia_semana, hora_del_dia
),
completado AS (
  SELECT
    EXTRACT(ISODOW FROM "updatedAt") AS dia_semana,
    EXTRACT(HOUR FROM "updatedAt") AS hora_del_dia,
    COUNT(*) AS num_tareas_completadas
  FROM tareas
  WHERE completed = true
  GROUP BY dia_semana, hora_del_dia
)
SELECT
  (SELECT CONCAT('Día: ', dia_semana, ', Hora: ', hora_del_dia) FROM creacion ORDER BY num_tareas_creadas DESC LIMIT 1) AS pico_creacion,
  (SELECT CONCAT('Día: ', dia_semana, ', Hora: ', hora_del_dia) FROM completado ORDER BY num_tareas_completadas DESC LIMIT 1) AS pico_completado;

----------------------------------------------------------------------

/*¿Cuántas tareas están actualmente vencidas, agrupadas por usuario y categoría, y cuál es el promedio de días que están vencidas?*/

-- Respuesta esperada: 
/*



*/

SELECT
  u.name AS usuario,
  c.name AS categoria,
  COUNT(t.id) AS tareas_vencidas,  
  CONCAT(FLOOR(EXTRACT(EPOCH FROM AVG(NOW() - t."dueDate")) / 86400), ' días') AS promedio_dias_vencida
FROM tareas t
JOIN usuarios u ON t."userId" = u.id
LEFT JOIN categorias c ON t."categoryId" = c.id
WHERE t.completed = false AND t."dueDate" < NOW()
GROUP BY u.name, c.name
ORDER BY tareas_vencidas DESC;

----------------------------------------------------------------------

/*¿Cuáles son las etiquetas más frecuentemente utilizadas, y qué etiquetas están asociadas con las tasas de completado más altas?*/

-- Respuesta esperada: 
/*



*/

WITH frecuencia_etiquetas AS (
  SELECT
    e.name AS etiqueta,
    COUNT(te."taskId") AS frecuencia
  FROM etiquetas e
  JOIN tarea_etiquetas te ON e.id = te."tagId"
  GROUP BY e.name
),
completado_etiquetas AS (
  SELECT
    e.name AS etiqueta,
    ROUND(
      (COUNT(t.id) FILTER (WHERE t.completed = true) * 100.0) / COUNT(t.id),
      2
    ) AS tasa_de_completado_porcentaje
  FROM etiquetas e
  JOIN tarea_etiquetas te ON e.id = te."tagId"
  JOIN tareas t ON te."taskId" = t.id
  GROUP BY e.name
)
SELECT
  (SELECT etiqueta FROM frecuencia_etiquetas ORDER BY frecuencia DESC LIMIT 1) AS etiqueta_mas_frecuente,
  (SELECT etiqueta FROM completado_etiquetas ORDER BY tasa_de_completado_porcentaje DESC LIMIT 1) AS etiqueta_mayor_completado;


----------------------------------------------------------------------

/*¿Cuántos usuarios han creado al menos una tarea en cada una de las últimas 4 semanas, y cuál es la tasa de retención semana a semana?*/

-- Respuesta esperada: 
/*



*/

WITH actividad_semanal AS (
  SELECT DISTINCT
    "userId",
    DATE_TRUNC('week', "createdAt") AS semana
  FROM tareas
  WHERE "createdAt" >= DATE_TRUNC('week', NOW()) - INTERVAL '3 weeks'
),
cohortes_semanales AS (
  SELECT
    "userId",
    MAX(CASE WHEN semana = DATE_TRUNC('week', NOW()) - INTERVAL '3 weeks' THEN 1 ELSE 0 END) AS semana_1, -- Hace 3 semanas
    MAX(CASE WHEN semana = DATE_TRUNC('week', NOW()) - INTERVAL '2 weeks' THEN 1 ELSE 0 END) AS semana_2,
    MAX(CASE WHEN semana = DATE_TRUNC('week', NOW()) - INTERVAL '1 week' THEN 1 ELSE 0 END) AS semana_3,
    MAX(CASE WHEN semana = DATE_TRUNC('week', NOW()) THEN 1 ELSE 0 END) AS semana_4 -- Semana actual
  FROM actividad_semanal
  GROUP BY "userId"
)
SELECT
  SUM(CASE WHEN semana_1=1 AND semana_2=1 AND semana_3=1 AND semana_4=1 THEN 1 ELSE 0 END) AS usuarios_activos_4_semanas,
  ROUND(SUM(CASE WHEN semana_1=1 AND semana_2=1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(semana_1), 0), 2) AS retencion_s1_a_s2,
  ROUND(SUM(CASE WHEN semana_2=1 AND semana_3=1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(semana_2), 0), 2) AS retencion_s2_a_s3,
  ROUND(SUM(CASE WHEN semana_3=1 AND semana_4=1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(semana_3), 0), 2) AS retencion_s3_a_s4
FROM cohortes_semanales;

----------------------------------------------------------------------

/*¿Cuál es la distribución de tareas a través de los niveles de prioridad para usuarios activos (usuarios que han iniciado sesión en los últimos 7 días)?*/

-- Respuesta esperada: 
/*



*/

WITH usuarios_activos AS (
  SELECT DISTINCT "userId"
  FROM tareas
  WHERE "createdAt" >= NOW() - INTERVAL '7 days'
)
SELECT
  t.priority AS prioridad,
  COUNT(t.id) AS numero_de_tareas
FROM tareas t
JOIN usuarios_activos ua ON t."userId" = ua."userId"
GROUP BY t.priority
ORDER BY numero_de_tareas DESC;

----------------------------------------------------------------------

/*¿Cómo varía la creación y completado de tareas por mes en el último año, y hay algún patrón estacional?*/

-- Respuesta esperada: 
/*



*/

SELECT
  TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') AS mes,
  COUNT(*) AS tareas_creadas,  
  COUNT(*) FILTER (WHERE completed = true) AS tareas_completadas
FROM tareas
WHERE "createdAt" >= NOW() - INTERVAL '1 year'
GROUP BY mes
ORDER BY mes;

----------------------------------------------------------------------

/*¿Qué usuarios están en el 10% superior por tasa de completado de tareas, y cuál es el número promedio de tareas que manejan simultáneamente?*/

-- Respuesta esperada: 
/*

[
  { "usuario": "Maria Rodriguez", "tasa_completado": "99.80", "tareas_incompletas_actuales": "2" },
  { "usuario": "Carlos Sanchez", "tasa_completado": "99.50", "tareas_incompletas_actuales": "5" },
  ...
]

*/

WITH tasas_de_completado AS (
  -- Calcula la tasa de completado para cada usuario con al menos 10 tareas
  SELECT
    "userId",
    ROUND((COUNT(*) FILTER (WHERE completed = true) * 100.0) / COUNT(*), 2) AS tasa_completado
  FROM tareas
  GROUP BY "userId"
  HAVING COUNT(*) >= 10
),
ranking_usuarios AS (
  -- Asigna un percentil a cada usuario basado en su tasa de completado
  SELECT
    "userId",
    tasa_completado,
    NTILE(100) OVER (ORDER BY tasa_completado DESC) AS percentil
  FROM tasas_de_completado
),
top_10_porciento AS (
  -- Filtra para obtener solo los usuarios en los percentiles del 1 al 10
  SELECT "userId", tasa_completado FROM ranking_usuarios WHERE percentil <= 10
),
tareas_incompletas_actuales AS (
  -- Calcula el número de tareas incompletas para cada usuario
  SELECT "userId", COUNT(*) AS num_incompletas
  FROM tareas
  WHERE completed = false
  GROUP BY "userId"
)
SELECT
  u.name AS usuario,
  t10.tasa_completado,
  COALESCE(ti.num_incompletas, 0) AS tareas_incompletas_actuales
FROM top_10_porciento t10
JOIN usuarios u ON t10."userId" = u.id
LEFT JOIN tareas_incompletas_actuales ti ON t10."userId" = ti."userId"
ORDER BY t10.tasa_completado DESC;