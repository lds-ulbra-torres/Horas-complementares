Olá <strong>{{ $name }}</strong>,
@if($status == 1)
<div>
	<p>Seu certificado de evento:{{ $event }} foi <strong style="color: green;">Aprovado.</strong></p>
	<p>Entre na plataforma para consultar as horas geradas.</p>
</div>
@elseif($status == 2)
<div>
	<p>Seu certificado de evento:{{ $event }} foi <strong style="color: red;">Reprovado.</strong></p>
	<p>Entre na plataforma para corrigir o certificado.</p>
</div>
@else
<div>
	<p>Seu certificado de evento:{{ $event }} foi avaliado.</p>
	<p>Entre na plataforma para conferir.</p>
</div>
@endif