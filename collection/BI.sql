/*¿Cuál es el promedio de tareas creadas por usuario en los últimos 30 días, y cómo se compara con los 30 días anteriores?*/

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
