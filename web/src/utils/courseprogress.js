const STORAGE_PREFIX = 'biblioteca-curso:';

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function getStorageKey(courseId) {
  return `${STORAGE_PREFIX}${courseId}`;
}

export function getCourseprogress(courseId) {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(getStorageKey(courseId));

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error('No se pudo leer el progreso del curso:', error);
    return null;
  }
}

export function startCourseTest(courseId, totalQuestions) {
  const current = getCourseprogress(courseId);

  if (current?.status === 'completed') {
    return current;
  }

  const progress = {
    courseId,
    status: 'in_progress',
    totalQuestions,
    answers: Array(totalQuestions).fill(null),
    score: null,
    percentage: null,
    startedAt: current?.startedAt ?? new Date().toISOString(),
    completedAt: null,
  };

  const storage = getStorage();

  if (storage) {
    storage.setItem(
      getStorageKey(courseId),
      JSON.stringify(progress),
    );
  }

  return progress;
}

export function saveAnswer(courseId, questionIndex, answerIndex, totalQuestions) {
  const current =
    getCourseProgress(courseId) ??
    startCourseTest(courseId, totalQuestions);

  const answers = [...(current.answers ?? [])];

  answers[questionIndex] = answerIndex;

  const updated = {
    ...current,
    status: 'in_progress',
    answers,
  };

  const storage = getStorage();

  if (storage) {
    storage.setItem(
      getStorageKey(courseId),
      JSON.stringify(updated),
    );
  }

  return updated;
}

export function completeCourseTest(courseId, questions, answers) {
  let correctas = 0;

  questions.forEach((question, index) => {
    if (answers[index] === question.correcta) {
      correctas += 1;
    }
  });

  const total = questions.length;

  const percentage =
    total > 0
      ? Math.round((correctas / total) * 100)
      : 0;

  const result = {
    courseId,
    status: 'completed',
    totalQuestions: total,
    answers,
    score: correctas,
    percentage,
    startedAt:
      getCourseProgress(courseId)?.startedAt ??
      new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  const storage = getStorage();

  if (storage) {
    storage.setItem(
      getStorageKey(courseId),
      JSON.stringify(result),
    );
  }

  return result;
}

export function isTestInProgress(courseId) {
  return getCourseProgress(courseId)?.status === 'in_progress';
}

export function isTestCompleted(courseId) {
  return getCourseProgress(courseId)?.status === 'completed';
}